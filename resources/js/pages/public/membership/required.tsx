import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/pages/public/components/header';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

type Plan = {
    id: number;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
    selected: boolean;
};

const plans: Plan[] = [
    {
        id: 1,
        name: 'Monthly',
        price: '$ 125.00',
        period: '/Cost Monthly',
        description: 'Perfecto para agentes individuales',
        features: ['30 Days Access', 'Full access for 1 user', 'Email support', 'Property history', 'Location information'],
        popular: false,
        selected: false,
    },
    {
        id: 2,
        name: 'Quarterly',
        price: '$ 375.00',
        period: '/Cost Quarterly',
        description: 'Ideal para equipos pequeños',
        features: ['90 Days Access', 'Full access for 1 user', 'Email support', 'Property history', 'Location information'],
        popular: true,
        selected: false,
    },
    {
        id: 3,
        name: 'Biannual',
        price: '$ 750.00',
        period: '/Cost Biannual',
        description: 'Para empresas y grandes equipos',
        features: ['180 Days Access', 'Full access for 1 user', 'Email support', 'Property history', 'Location information'],
        popular: false,
        selected: false,
    },
    {
        id: 4,
        name: 'Annual',
        price: '$ 1,500.00',
        period: '/Cost Annual',
        description: 'Para empresas y grandes equipos',
        features: ['365 Days Access', 'Full access for 1 user', 'Email support', 'Property history', 'Location information'],
        popular: false,
        selected: false,
    },
];

export default function RequiredMembership(): JSX.Element {
    const { auth } = usePage<SharedData>().props;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const [paypalClicked, setPaypalClicked] = useState(false);
    const [plansSelected, setPlansSelected] = useState<Plan | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD&disable-funding=card,credit`;
        // script.addEventListener('load', () => {
        //     renderPayPalButtons();
        // });
        document.body.appendChild(script);
    }, []);

    // Remove setLoadPayPal, not needed anymore

    const renderPayPalButtons = (planSelected: Plan | null) => {
      toast.info('Payment process', {
          description: 'Please continue with your payment process.',
      });
        if (!window.paypal) return;
        window.paypal
            .Buttons({
                createOrder: async () => {
                    const res = await fetch('/paypal/create-order', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': token,
                        },
                        body: JSON.stringify({'planId': planSelected?.id}), // Monto del pago
                    });
                    const data = await res.json();
                    return data.id; // orderID
                },
                onApprove: async (data: { orderID: any; }) => {
                    const res = await fetch('/paypal/capture-order', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': token,
                        },
                        body: JSON.stringify({ orderId: data.orderID, 'planId': planSelected?.id }),
                    });
                    const capture = await res.json();
                    if(!capture.success){
                        toast.error('Error to payment', {
                            description: 'An error occurred while processing the payment.',
                        });
                    }else{
                      toast.success('Successful payment',{
                        description: 'Your payment has been processed successfully.',
                      });
                      // 🔁 Redirigir al dashboard de Inertia
                      router.visit('/dashboard', {
                        preserveState: false,
                        preserveScroll: true,
                      });
                    }
                },
                onError: (error: any) => {
                    console.error('Error PayPal:', error);
                    toast.error('Error to payment', {
                        description: 'An error occurred while processing the payment.',
                    });
                },
            })
            .render('#paypal-button-container');
    };

    function setPaypalSelected(plan: Plan): void {
      setPaypalLoaded(true);
      setPlansSelected(plan);
      renderPayPalButtons(plan);
    }

    return (
        <>
            <div className="h-screen bg-[url('https://comperiapr.com/assets/img/backgrounds/1.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
                <Header />
                <main>
                    <section id="pricing" className="pt-15 pb-5 lg:pt-20">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-default mx-auto mb-12 max-w-6xl rounded-md px-3 py-3 text-center text-white supports-[backdrop-filter]:bg-black/50">
                                <h3 className="text-start">
                                    Hello, {auth.user.first_name} {auth.user.last_name}!
                                </h3>
                                {/* <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Planes diseñados para tu éxito</h2>
                                <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                                    Elige el plan que mejor se adapte a tus necesidades. Todos incluyen acceso completo durante el período de prueba.
                                </p> */}
                            </div>

                            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4" style={paypalLoaded ? { display: 'none' } : { display: '' }}>
                                {plans.map((plan, index) => (
                                    <Card key={index} className={`relative ${plan.popular ? 'border-blue-700 scale-100' : 'border-border'}`}>
                                        {plan.popular && (
                                            <Badge className="absolute -top-3 left-1/2 border-blue-700 -translate-x-1/2 transform bg-blue-100 text-black">
                                                Most Popular
                                            </Badge>
                                        )}
                                        <CardHeader className="pb-2 text-center">
                                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                            {/* <CardDescription className="text-base">{plan.description}</CardDescription> */}
                                            <div className="mt-4">
                                                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                                                <p className="text-xs text-muted-foreground">{plan.period}</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <ul className="space-y-1">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-start">
                                                        <Check className="text-pr-green mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                                                        <span className="text-xs text-muted-foreground">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className="relative">
                                            <Button 
                                              type='button'
                                              className="w-full" 
                                              variant={plan.selected ? 'default' : 'outline'} 
                                              size="lg"
                                              onClick={() => setPaypalSelected(plan)}>
                                                {'Seleccionar Plan'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            <div 
                              style={paypalLoaded ? { display: '' } : { display: 'none' }}
                              className="mx-auto mt-12 max-w-2xl rounded-md border border-border bg-white/80 p-6 py-3 text-center"
                            >
                                <div className="w-full flex justify-end">
                                    <Link href="/dashboard" className="pt-0 mt-0"><strong>{'<- back to plans'}</strong></Link>
                                </div>
                                <div className='w-full'>
                                    <p className="mb-1 text-xs font-bold text-foreground sm:text-2xl">Complete your plan payment: {plansSelected ? plansSelected.name : ''}</p>
                                    <p className="mb-2 mx-auto max-w-2xl text-lg text-muted-foreground">
                                        Amount: {plansSelected ? plansSelected.price : ''}
                                    </p>
                                </div>
                                <div id="paypal-button-container"></div>
                                <Button
                                    type="button"
                                    className="w-full shadow py-6"
                                    style={{ 
                                        backgroundImage: "url('/images/ATHM_Logo.svg')", 
                                        backgroundColor: 'white',
                                        backgroundSize: 'auto',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                </Button>
                            </div>

                            <div className="mx-auto mt-6 max-w-2xl rounded-md border border-border bg-white/80 p-6 text-center">
                                <p className="mb-4 text-muted-foreground text-slate-950">Do you need a customized plan for your company?</p>
                                <Button variant="outline" size="lg">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>
                {/* <Footer /> */}
            </div>
            <Toaster position="top-center" richColors toastOptions={{ style: { fontSize: "0.8rem" } }} />
        </>
    );
}
