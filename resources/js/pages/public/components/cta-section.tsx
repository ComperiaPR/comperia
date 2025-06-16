import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Clock, Users } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-pr-blue/5 via-background to-pr-turquoise/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Comienza tu prueba gratuita hoy</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a miles de profesionales que ya están usando Comperia para tomar mejores decisiones en el
              mercado inmobiliario.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                Comenzar Prueba Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Agendar Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-pr-blue" />
                <span>Sin compromiso</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-pr-green" />
                <span>Configuración en 5 min</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-pr-turquoise" />
                <span>Soporte incluido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
