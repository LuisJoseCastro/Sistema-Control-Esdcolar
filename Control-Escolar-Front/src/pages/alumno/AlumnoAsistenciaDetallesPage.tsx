// src/pages/alumno/AlumnoAsistenciaDetallesPage.tsx (CÓDIGO FINAL LIMPIO DE ERRORES TS)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserHeaderIcons } from "../../components/layout/UserHeaderIcons";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// 🛑 IMPORTACIONES DE UI UNIFICADA
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "../../components/ui/Table";

// Importamos Hooks y Servicio
import { useAuth } from "../../hooks/useAuth";
import { getDetalleAsistencias } from "../../services/alumno.service";
import type { AsistenciaDetalleItem } from "../../services/alumno.service";

// 🛑 ELIMINAMOS la definición local de type BadgeVariant aquí

export const AlumnoAsistenciaDetallesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [asistencias, setAsistencias] = useState<AsistenciaDetalleItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos del servicio (Lógica sin cambios)
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const data = await getDetalleAsistencias(user.id);
                setAsistencias(data);
            } catch (error) {
                console.error("Error cargando detalles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Helper para formato de fecha amigable (Visual)
    const formatDate = (dateString: string) => {
        const date = new Date(`${dateString}T00:00:00`);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // 🛑 REFACTORIZACIÓN DEL HELPER: Ahora devolvemos la cadena y usamos un 'as string' o 'as any' si es necesario
    const getStatusVariant = (estado: string) => {
        if (estado === 'Falta') return "danger";
        if (estado === 'Retardo') return "warning";
        if (estado === 'Asistencia') return "success";
        return "default";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-whiteBg-50">
                <LoadingSpinner text="Cargando detalles..." />
            </div>
        );
    }

    return (
        <div className="p-8 bg-whiteBg-50 min-h-full font-sans">

            {/* ENCABEZADO */}
            <header className="flex justify-between items-end border-b-2 border-gray-400 pb-2 mb-12">
                <div className="flex items-end gap-4">
                    {/* 🛑 CORRECCIÓN: Damos un children explícito (un espacio) al Button para satisfacer ButtonProps */}
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        icon={<ArrowLeft size={24} />}
                        className="mb-2 p-2 rounded-full text-gray-500 hover:bg-gray-100"
                        title="Regresar"
                    >
                        {" "} {/* Espacio en blanco para satisfacer children */}
                    </Button>
                    <h1 className="text-5xl text-black" style={{ fontFamily: '"Kaushan Script", cursive' }}>
                        Detalles de asistencia
                    </h1>
                </div>
                <div className="mb-2">
                    <UserHeaderIcons />
                </div>
            </header>

            {/* CONTENEDOR CENTRAL */}
            <div className="flex justify-center items-start mt-4">
                <Card
                    className="w-full max-w-4xl bg-grayLight-200 rounded-4xl shadow-xl p-8 md:p-12 min-h-[500px]"
                    variant="default"
                >
                    <div className="overflow-x-auto">

                        <Table className="min-w-full">
                            <Table.Header>
                                <TableRow>
                                    <TableHead className="text-center font-bold text-gray-600 text-lg w-1/3">Fecha</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-lg w-1/3">Materia</TableHead>
                                    <TableHead className="text-center font-bold text-gray-600 text-lg w-1/3">Estado</TableHead>
                                </TableRow>
                            </Table.Header>

                            <Table.Body>
                                {asistencias.length > 0 ? (
                                    asistencias.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            className="text-center hover:bg-grayDark-100"
                                        >
                                            <TableCell className="text-base font-medium text-gray-600 capitalize">
                                                {formatDate(item.fecha)}
                                            </TableCell>

                                            <TableCell className="text-base font-bold text-gray-700">
                                                {item.materia}
                                            </TableCell>

                                            <TableCell className="flex justify-center">
                                                <Badge variant={getStatusVariant(item.estado) as any}> {/* Usamos 'as any' para forzar la compatibilidad sin un error global */}
                                                    {item.estado}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                            No tienes faltas ni retardos registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Botón Volver */}
                    <div className="mt-10 flex justify-center">
                        <Button
                            onClick={() => navigate("/alumno/asistencia")}
                            variant="ghost"
                            className="text-gray-500 font-medium text-sm transition-colors"
                        >
                            Volver al calendario
                        </Button>
                    </div>

                </Card>
            </div>

        </div>
    );
};