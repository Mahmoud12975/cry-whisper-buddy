
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cryTypeInfo } from "@/lib/cryTypes";
import { Baby, HelpCircle } from "lucide-react";

const InfoPanel = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-baby-purple" />
        <h2 className="text-lg font-medium">About Baby Cries</h2>
      </div>
      
      <p className="mb-4 text-sm text-muted-foreground">
        Babies communicate their needs primarily through crying. Learning to distinguish 
        between different types of cries can help caregivers respond more effectively
        to their baby's needs.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(cryTypeInfo).map(([key, info]) => (
          <AccordionItem key={key} value={key} className={`border-l-4 border-${info.color} pl-2`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Baby className="h-4 w-4" />
                <span>{info.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">{info.description}</p>
              
              <div className="mb-2">
                <h4 className="text-sm font-medium">Key Characteristics:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {info.characteristics.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">How to Respond:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {info.caregiverTips.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-6 text-xs text-center text-muted-foreground">
        <p>
          This tool is for informational purposes only and not intended to replace
          professional medical advice. Always consult with healthcare providers for
          concerns about your baby's health.
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
