export default {
    async generarReporte(tipoReporte, parametros) {
        if (!['balance', 'estado-resultados', 'volumen'].includes(tipoReporte)) {
            throw new Error("Tipo de reporte no soportado");
        }
        return null;
    }
};