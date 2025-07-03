import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OrganizationsAutocomplete from '@/components/organizations-autocomplete';
import { CreateNoticeDTO } from '@/dtos/create-notice.dto';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { NoticeStatus, NoticeStatusLabels } from '@/enums/notice-status';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Send, ALargeSmall } from 'lucide-react';
import { Notice } from '@/dtos/notice.entity';
import { embedNotice, getNotice } from '@/services/notice.service';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import MarkdownRenderer from './MarkdownRenderer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const initialNoticeState: CreateNoticeDTO = {
  title: '',
  deadline: '',
  pdfBase64: '',
  organization: { name: '' },
};

interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateNoticeDTO) => Promise<void>;
  noticeId?: string | null;
}

export function NoticeFormDialog({ open, onOpenChange, onSubmit, noticeId }: NoticeFormDialogProps) {
  const [currentNotice, setCurrentNotice] = useState<CreateNoticeDTO>(initialNoticeState);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [errors, setErrors] = useState({
    title: '',
    deadline: '',
    pdfBase64: '',
    organization: '',
  });
  const [pdfOpen, setPdfOpen] = useState(false);
  const [markdownOpen, setMarkdownOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    if (open && noticeId) {
      setIsLoading(true);
      getNotice(noticeId)
        .then((data) => {
          setNotice(data);
          setCurrentNotice({
            title: data.title,
            deadline: new Date(data.deadline).toISOString().split('T')[0],
            pdfBase64: data.pdfBase64,
            organization: data.organization,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching notice:', err);
          toast.error('Erro ao carregar dados do edital');
          setIsLoading(false);
        });
    }
  }, [open, noticeId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      deadline: '',
      pdfBase64: '',
      organization: '',
    };

    if (!currentNotice.title?.trim()) {
      newErrors.title = 'O título é obrigatório';
      isValid = false;
    }

    if (!currentNotice.deadline) {
      newErrors.deadline = 'A data final é obrigatória';
      isValid = false;
    }

    if (!noticeId && !currentNotice.pdfBase64) {
      newErrors.pdfBase64 = 'O arquivo PDF é obrigatório';
      isValid = false;
    }

    if (!currentNotice.organization?.name?.trim()) {
      newErrors.organization = 'A instituição é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({
        ...prev,
        pdfBase64: 'Por favor, envie um arquivo no formato PDF',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentNotice((prev) => ({
        ...prev,
        pdfBase64: reader.result as string,
      }));
      setErrors((prev) => ({
        ...prev,
        pdfBase64: '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(currentNotice);
      onOpenChange(false);
      setCurrentNotice(initialNoticeState);
      toast.success(noticeId ? 'Edital atualizado com sucesso!' : 'Edital criado com sucesso!');
    } catch (err) {
      toast.error('Erro ao salvar edital. Verifique os dados e tente novamente.');
      console.error('Erro ao salvar edital:', err);
    }
  };

  const handleProcessNotice = async () => {
    if (!notice || !noticeId) return;

    try {
      setIsProcessing(true);
      await embedNotice(noticeId);
      toast.success('Edital enviado para processamento');
      onOpenChange(false);
      setCurrentNotice(initialNoticeState);
    } catch (err) {
      toast.error('Erro ao processar edital');
      console.error('Error processing notice:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const openPdf = () => {
    setPdfOpen(true);
  };

  const openMarkdown = () => {
    setMarkdownOpen(true);
  };

  const onPdfLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const dialogTitle = noticeId ? 'Editar Edital' : 'Adicionar Novo Edital';
  const dialogDescription = noticeId
    ? 'Atualize os dados do edital.'
    : 'Crie um novo edital para ser adicionado ao sistema.';

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados do edital...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          {noticeId && notice && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Dados do Edital</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={currentNotice.title}
                      onChange={(e) => {
                        setCurrentNotice({ ...currentNotice, title: e.target.value });
                        setErrors((prev) => ({ ...prev, title: '' }));
                      }}
                      placeholder="Digite o título do edital"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-xs text-red-500 -mt-1">{errors.title}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Data Final</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={currentNotice.deadline}
                      onChange={(e) => {
                        setCurrentNotice({ ...currentNotice, deadline: e.target.value });
                        setErrors((prev) => ({ ...prev, deadline: '' }));
                      }}
                      className={errors.deadline ? 'border-red-500' : ''}
                    />
                    {errors.deadline && <p className="text-xs text-red-500 -mt-1">{errors.deadline}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="organization_id">Instituição</Label>
                    <OrganizationsAutocomplete
                      id="organization_id"
                      value={currentNotice.organization?.name || ''}
                      onChange={(org) => {
                        setCurrentNotice({ ...currentNotice, organization: org });
                        setErrors((prev) => ({ ...prev, organization: '' }));
                      }}
                      placeholder="Digite o nome da instituição"
                      className={errors.organization ? 'border-red-500' : ''}
                    />
                    {errors.organization && <p className="text-xs text-red-500 -mt-1">{errors.organization}</p>}
                  </div>
                  {!noticeId && (
                    <div className="grid gap-2">
                      <Label htmlFor="pdf">Arquivo PDF</Label>
                      <Input
                        id="pdf"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className={errors.pdfBase64 ? 'border-red-500' : ''}
                      />
                      {errors.pdfBase64 && <p className="text-xs text-red-500 -mt-1">{errors.pdfBase64}</p>}
                    </div>
                  )}
                </div>

                {noticeId && notice && (
                  <div className="grid gap-2">
                    <Label htmlFor="pdf">Status</Label>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            notice.status === NoticeStatus.PENDING
                              ? 'secondary'
                              : notice.status === NoticeStatus.ERROR
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {NoticeStatusLabels[notice.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="content">
                <div className="flex flex-col gap-4 py-4">
                  <Button className="w-full" variant="outline" onClick={openPdf} disabled={!notice.pdfBase64}>
                    <FileText className="mr-2 h-4 w-4" />
                    Visualizar PDF
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={openMarkdown}
                    disabled={!notice.contentMarkdown}
                  >
                    <ALargeSmall className="mr-2 h-4 w-4" />
                    Visualizar em Texto
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!noticeId && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={currentNotice.title}
                  onChange={(e) => {
                    setCurrentNotice({ ...currentNotice, title: e.target.value });
                    setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="Digite o título do edital"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-xs text-red-500 -mt-1">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Data Final</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={currentNotice.deadline}
                  onChange={(e) => {
                    setCurrentNotice({ ...currentNotice, deadline: e.target.value });
                    setErrors((prev) => ({ ...prev, deadline: '' }));
                  }}
                  className={errors.deadline ? 'border-red-500' : ''}
                />
                {errors.deadline && <p className="text-xs text-red-500 -mt-1">{errors.deadline}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization_id">Instituição</Label>
                <OrganizationsAutocomplete
                  id="organization_id"
                  value={currentNotice.organization?.name || ''}
                  onChange={(org) => {
                    setCurrentNotice({ ...currentNotice, organization: org });
                    setErrors((prev) => ({ ...prev, organization: '' }));
                  }}
                  placeholder="Digite o nome da instituição"
                  className={errors.organization ? 'border-red-500' : ''}
                />
                {errors.organization && <p className="text-xs text-red-500 -mt-1">{errors.organization}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pdf">Arquivo PDF</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className={errors.pdfBase64 ? 'border-red-500' : ''}
                />
                {errors.pdfBase64 && <p className="text-xs text-red-500 -mt-1">{errors.pdfBase64}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {(notice && notice.status === NoticeStatus.PENDING) ||
              (notice?.status === NoticeStatus.ERROR && (
                <Button variant="secondary" onClick={handleProcessNotice} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Processar Edital
                    </>
                  )}
                </Button>
              ))}
            <Button onClick={handleSubmit}>{noticeId ? 'Salvar Alterações' : 'Adicionar edital'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="min-w-[850px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Visualizar PDF</DialogTitle>
            <DialogDescription>Visualização do documento PDF do edital</DialogDescription>
          </DialogHeader>
          <div className="flex overflow-auto">
            {notice?.pdfBase64 && (
              <Document
                file={notice.pdfBase64}
                onLoadSuccess={onPdfLoadSuccess}
                loading={
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={800}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    }
                  />
                ))}
              </Document>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Markdown Viewer Modal */}
      <Dialog open={markdownOpen} onOpenChange={setMarkdownOpen}>
        <DialogContent className="min-w-[850px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Visualizar Texto</DialogTitle>
            <DialogDescription>Visualização do conteúdo em texto do edital</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 bg-gray-50 rounded-md">
            {notice?.contentMarkdown ? (
              <MarkdownRenderer markdown={notice.contentMarkdown} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhum conteúdo em texto disponível
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
