import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, History, DollarSign, MapPin, Users, FileText, BarChart3, Shield } from "lucide-react"

const features = [
  {
    icon: History,
    title: "Historial Completo",
    description: "Accede al historial detallado de compras y ventas de cualquier propiedad en Puerto Rico.",
  },
  {
    icon: DollarSign,
    title: "Valores Actualizados",
    description: "Consulta valores actuales y históricos, incluyendo costos por metro cuadrado.",
  },
  {
    icon: Users,
    title: "Compradores y Vendedores",
    description: "Información detallada sobre quiénes han sido los compradores y vendedores.",
  },
  {
    icon: MapPin,
    title: "Ubicaciones Precisas",
    description: "Mapas interactivos con ubicaciones exactas y datos geográficos detallados.",
  },
  {
    icon: FileText,
    title: "Información de Notarios",
    description: "Base de datos completa de notarios involucrados en las transacciones.",
  },
  {
    icon: BarChart3,
    title: "Análisis de Mercado",
    description: "Tendencias del mercado, estadísticas y análisis comparativos por zona.",
  },
  {
    icon: Search,
    title: "Búsqueda Avanzada",
    description: "Filtros potentes para encontrar exactamente la información que necesitas.",
  },
  {
    icon: Shield,
    title: "Datos Verificados",
    description: "Información oficial y verificada de fuentes gubernamentales confiables.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitas en una sola plataforma
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas profesionales para profesionales del sector inmobiliario, inversionistas y cualquier persona
            interesada en el mercado de propiedades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            // Rotar entre los colores de Puerto Rico
            const colors = [
              { bg: "bg-pr-blue/10", text: "text-pr-blue" },
              { bg: "bg-pr-red/10", text: "text-pr-red" },
              { bg: "bg-pr-green/10", text: "text-pr-green" },
              { bg: "bg-pr-turquoise/10", text: "text-pr-turquoise" },
            ]
            const colorSet = colors[index % colors.length]

            return (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className={`${colorSet.bg} p-3 rounded-lg w-fit mb-3`}>
                    <feature.icon className={`h-6 w-6 ${colorSet.text}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
