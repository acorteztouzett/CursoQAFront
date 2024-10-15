import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function DealSelects({ value, onChange, options, placeholder }) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px] text-[1.2rem] font-semibold border-none shadow-none p-0 m-0 h-max focus:ring-0">
        <SelectValue placeholder={placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          return (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function DealPopovers({ setValue, options, children }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            <CommandInput placeholder="Search assignee..." className="h-9" />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={crypto.randomUUID()}
                  value={option.name}
                  onSelect={() => {
                    setValue("assignee", option)
                  }}>
                  <Avatar className="mr-2 h-4 w-4 rounded-xl">
                    <AvatarImage src={option.avatar} alt="The Assignee's Avatar" />
                    <AvatarFallback>{option.name}</AvatarFallback>
                  </Avatar>
                  <span>{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SelectPriority({ task, field }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={task?.priority ?? field.value}>
      <SelectTrigger
        className="border-none shadow-none h-7 p-0 w-max focus:ring-0 text-s font-medium"
        variant="outline">
        {task?.priority || field.value ? (
          <SelectValue />
        ) : (
          <Badge className="rounded-xl py-1 px-1" variant="outline">
            <Plus size="16" />
          </Badge>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {priorities.map((e) => {
            return (
              <SelectItem key={e.value} value={e.value}>
                <div className="flex w-max py-[2px] rounded-[37px] items-center bg-white border shadow-sm">
                  <div className="ml-1"><e.icon /></div>
                  <span className="ml-2 mr-2 text-s">{e.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SelectStatus({ task, field }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={task?.status ?? field.value}>
      <SelectTrigger
        className="border-none shadow-none h-7 p-0 w-max focus:ring-0 text-s font-medium"
        variant="outline">
        {task?.status || field.value ? (
          <SelectValue />
        ) : (
          <Badge className="rounded-xl py-1 px-1" variant="outline">
            <Plus size="16" />
          </Badge>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {formStatuses.map((e) => {
            return (
              <SelectItem key={e.value} value={e.value}>
                <div
                  className={
                    "flex w-max py-[2px] rounded-[37px] items-center shadow-sm" + e.bg
                  }>
                    <e.icon />
                  <span className="text-s font-medium ml-1 mr-2">{e.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SelectLabel({ task, field }) {
  return (
    <Select onValueChange={field.onChange} defaultValue={task?.label ?? field.value}>
      <SelectTrigger
        className="border-none shadow-none h-7 p-0 w-max focus:ring-0 text-s font-medium"
        variant="outline">
        {task?.label || field.value ? (
          <SelectValue />
        ) : (
          <Badge className="rounded-xl py-1 px-1" variant="outline">
            <Plus size="16" />
          </Badge>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {labels.map((e) => {
            return (
              <SelectItem key={e.value} value={e.value}>
                <Badge
                  className={cn(e.style, "py-[2px] border border-solid")}
                  variant="outline">
                  {e.label}
                </Badge>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
