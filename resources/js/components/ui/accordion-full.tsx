import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react"
// import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

function CustomAccordion({
  className,
  ...props
}: React.ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root
      className={cn("w-full rounded-md bg-mauve6 shadow-[0_2px_10px] shadow-black/5", className)}
      {...props}
    />
  );
}

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Accordion.Item>>(
  ({ className, ...props }, forwardedRef) => (
	<Accordion.Item
	  data-slot="card-header"
	  className={cn(
		"mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12",
		className,
	  )}
	  {...props}
	  ref={forwardedRef}
	/>
  )
);

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Accordion.Trigger>>(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Header className="flex">
			<Accordion.Trigger
				className={cn(
					"group flex h-[45px] flex-1 cursor-default items-center justify-between bg-mauve1 px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2",
					className,
				)}
				{...props}
				ref={forwardedRef}
			>
				{children}
				<ChevronDownIcon
					className="transition-transform data-[state=open]:rotate-180"
					aria-hidden
				/>
			</Accordion.Trigger>
		</Accordion.Header>
	),
);

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Accordion.Content>>(
	({ children, className, ...props }, forwardedRef) => (
		<Accordion.Content
			className={cn(
				"overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
				className,
			)}
			{...props}
			ref={forwardedRef}
		>
			<div className="px-5 py-[15px]">{children}</div>
		</Accordion.Content>
	),
);

export { CustomAccordion, AccordionItem, AccordionTrigger, AccordionContent }