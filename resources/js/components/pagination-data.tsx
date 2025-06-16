import React, { useMemo } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationDataProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function PaginationData({ currentPage, totalPages, onPageChange }: PaginationDataProps) {
    const generatePaginationItems = useMemo(() => {
        const items = [];

        // Siempre mostrar la primera página
        if (totalPages > 0) {
            items.push(
                <PaginationItem key="page-1">
                    <PaginationLink
                        isActive={currentPage === 1}
                        onClick={() => onPageChange(1)}
                        className={currentPage === 1 ? 'bg-primary hover:bg-primary-dark cursor-pointer text-white hover:text-white' : 'hover:text-primary cursor-pointer'}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Mostrar elipsis si hay muchas páginas antes de la actual
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Páginas alrededor de la página actual
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={`page-${i}`}>
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => onPageChange(i)}
                        className={currentPage === i ? 'bg-primary hover:bg-primary-dark cursor-pointer text-white hover:text-white' : 'hover:text-primary cursor-pointer'}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Mostrar elipsis si hay muchas páginas después de la actual
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Siempre mostrar la última página si hay más de una
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={`page-${totalPages}`}>
                    <PaginationLink
                        isActive={currentPage === totalPages}
                        onClick={() => onPageChange(totalPages)}
                        className={currentPage === totalPages ? 'bg-primary hover:bg-primary-dark cursor-pointer text-white hover:text-white' : 'hover:text-primary cursor-pointer'}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    }, [currentPage, totalPages, onPageChange]);

    return (
        <div className="flex flex-col gap-4">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:text-primary hover:border-primary cursor-pointer'}
                        />
                    </PaginationItem>
                    {generatePaginationItems}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:text-primary hover:border-primary cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default React.memo(PaginationData);
