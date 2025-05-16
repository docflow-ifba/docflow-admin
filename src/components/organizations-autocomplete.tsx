import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Organization } from "@/dtos/organization"
import { cn } from "@/lib/utils"
import { findOrganizations } from "@/services/organization.service"

interface OrganizationsAutocompleteProps {
  id?: string
  value: string
  onChange: (value: Organization) => void
  placeholder?: string
}

export default function OrganizationsAutocomplete({
  id,
  value,
  onChange,
  placeholder = "Select organization...",
}: OrganizationsAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [organizations, setOrganizations] = React.useState<Organization[]>([])
  const [loading, setLoading] = React.useState(false)

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      setLoading(true)
      const result = await findOrganizations(query)
      setOrganizations(result)
      setLoading(false)
    } else {
      setOrganizations([])
    }
  }

  const handleSelect = (selectedValue: Organization) => {
    onChange(selectedValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Pesquisar instituições..."
            className="h-9"
            onValueChange={handleSearch}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Carregando...</CommandEmpty>
            ) : organizations.length === 0 ? (
              <CommandEmpty>Nenhuma instituição encontrada.</CommandEmpty>
            ) : (
              <CommandGroup>
                {organizations.map((org) => (
                  <CommandItem
                    key={org.organizationId}
                    value={org.name}
                    onSelect={() => handleSelect(org)}
                  >
                    {org.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === org.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
