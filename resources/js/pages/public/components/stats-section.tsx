import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    number: "$2.5B+",
    label: "Valor total de propiedades",
    description: "Registradas en nuestra plataforma",
  },
  {
    number: "15 años",
    label: "De datos históricos",
    description: "Información desde 2009",
  },
  {
    number: "99.9%",
    label: "Precisión de datos",
    description: "Verificados oficialmente",
  },
  {
    number: "24/7",
    label: "Acceso disponible",
    description: "Consulta cuando necesites",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Números que hablan por sí solos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La confianza de miles de profesionales respalda nuestra plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const colors = ["text-pr-blue", "text-pr-red", "text-pr-green", "text-pr-turquoise"]
            const colorClass = colors[index % colors.length]

            return (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="pt-8 pb-6">
                  <div className={`text-4xl font-bold ${colorClass} mb-2`}>{stat.number}</div>
                  <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
