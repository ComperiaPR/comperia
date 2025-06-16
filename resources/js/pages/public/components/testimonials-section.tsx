import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Agente Inmobiliaria",
    company: "RE/MAX Puerto Rico",
    content:
      "Comperia ha revolucionado mi trabajo. Ahora puedo ofrecer a mis clientes información detallada y precisa en segundos. Es una herramienta indispensable.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Inversionista",
    company: "Grupo Inmobiliario CR",
    content:
      "La plataforma me permite analizar tendencias del mercado y tomar decisiones de inversión informadas. Los datos históricos son increíblemente valiosos.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Tasadora Certificada",
    company: "Valuaciones Profesionales",
    content:
      "Como tasadora, necesito datos precisos y actualizados. Comperia me proporciona toda la información que necesito para mis evaluaciones.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Profesionales de toda la isla confían en nuestra plataforma para sus decisiones más importantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
