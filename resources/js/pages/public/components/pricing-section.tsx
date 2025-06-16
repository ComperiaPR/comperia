import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "$29",
    period: "/mes",
    description: "Perfecto para agentes individuales",
    features: [
      "Hasta 50 consultas mensuales",
      "Historial básico de propiedades",
      "Información de ubicación",
      "Soporte por email",
      "Acceso a app móvil",
    ],
    popular: false,
  },
  {
    name: "Profesional",
    price: "$79",
    period: "/mes",
    description: "Ideal para equipos pequeños",
    features: [
      "Hasta 200 consultas mensuales",
      "Historial completo de transacciones",
      "Análisis de mercado avanzado",
      "Información de notarios",
      "Exportación de reportes",
      "Soporte prioritario",
      "API de integración",
    ],
    popular: true,
  },
  {
    name: "Empresarial",
    price: "$199",
    period: "/mes",
    description: "Para empresas y grandes equipos",
    features: [
      "Consultas ilimitadas",
      "Acceso completo a toda la base de datos",
      "Análisis predictivo",
      "Dashboard personalizado",
      "Múltiples usuarios",
      "Soporte 24/7",
      "Integración personalizada",
      "Capacitación incluida",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Planes diseñados para tu éxito</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen acceso completo durante el período de
            prueba.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-pr-blue shadow-lg scale-105" : "border-border"}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pr-blue">Más Popular</Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-pr-green mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  {plan.popular ? "Comenzar Ahora" : "Seleccionar Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">¿Necesitas un plan personalizado para tu empresa?</p>
          <Button variant="outline" size="lg">
            Contactar Ventas
          </Button>
        </div>
      </div>
    </section>
  )
}
