import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SizeGuideModalProps {
  trigger: React.ReactNode;
}

const sizeData = [
  { size: "XS", bust: "80-84", waist: "60-64", hip: "86-90" },
  { size: "S", bust: "84-88", waist: "64-68", hip: "90-94" },
  { size: "M", bust: "88-92", waist: "68-72", hip: "94-98" },
  { size: "L", bust: "92-96", waist: "72-76", hip: "98-102" },
  { size: "XL", bust: "96-100", waist: "76-80", hip: "102-106" },
  { size: "XXL", bust: "100-104", waist: "80-84", hip: "106-110" },
];

const measurementTips = [
  { label: "Busto", description: "Medí alrededor de la parte más ancha del busto." },
  { label: "Cintura", description: "Medí alrededor de la parte más estrecha de tu cintura." },
  { label: "Cadera", description: "Medí alrededor de la parte más ancha de las caderas." },
];

const SizeGuideModal = ({ trigger }: SizeGuideModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">
            Guía de Talles
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Size Table */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Tabla de Medidas (cm)</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary">
                    <TableHead className="font-semibold text-foreground">Talle</TableHead>
                    <TableHead className="font-semibold text-foreground">Busto</TableHead>
                    <TableHead className="font-semibold text-foreground">Cintura</TableHead>
                    <TableHead className="font-semibold text-foreground">Cadera</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeData.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell className="font-medium">{row.size}</TableCell>
                      <TableCell>{row.bust}</TableCell>
                      <TableCell>{row.waist}</TableCell>
                      <TableCell>{row.hip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* How to Measure */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">¿Cómo tomar tus medidas?</h3>
            <div className="space-y-3">
              {measurementTips.map((tip) => (
                <div key={tip.label} className="flex gap-3">
                  <span className="font-medium text-primary min-w-[70px]">{tip.label}:</span>
                  <span className="text-muted-foreground">{tip.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">💡 Consejos</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Usá una cinta métrica flexible.</li>
              <li>Mantené la cinta recta y ajustada, pero sin apretar.</li>
              <li>Si estás entre dos talles, te recomendamos elegir el más grande.</li>
              <li>Las medidas pueden variar ligeramente según el modelo.</li>
            </ul>
          </div>

          {/* Contact for help */}
          <p className="text-sm text-muted-foreground text-center">
            ¿Necesitás ayuda? Contactanos a{" "}
            <a href="mailto:hola@prettylady.com" className="text-primary hover:underline">
              hola@prettylady.com
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal;
