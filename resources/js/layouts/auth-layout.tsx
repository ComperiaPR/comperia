import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    type,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    type: string;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} type={type} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
