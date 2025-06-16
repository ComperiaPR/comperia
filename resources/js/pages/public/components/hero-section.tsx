import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pr-blue/10 via-background to-pr-turquoise/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-pr-blue/10 text-pr-blue border-pr-blue/20">
            <MapPin className="w-4 h-4 mr-2" />
            Toda la información inmobiliaria de Puerto Rico
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            La plataforma más completa de <span className="text-pr-blue">propiedades</span> en Puerto Rico
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Accede al historial completo de compras, ventas, valores, ubicaciones y todos los datos que necesitas para
            tomar decisiones informadas en el mercado inmobiliario puertorriqueño.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Ver Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-pr-blue/10 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-pr-blue" />
              </div>
              <div className="text-2xl font-bold text-foreground">500K+</div>
              <div className="text-sm text-muted-foreground">Propiedades registradas</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-pr-green/10 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-pr-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Usuarios activos</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-pr-turquoise/10 p-3 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-pr-turquoise" />
              </div>
              <div className="text-2xl font-bold text-foreground">78</div>
              <div className="text-sm text-muted-foreground">Municipios cubiertos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
