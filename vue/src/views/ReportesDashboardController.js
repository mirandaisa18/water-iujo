export default {
    async getBalanceGeneral() { return {}; },
    async getEstadoResultados(filtros) {
        if (filtros && filtros.fechaInicio && filtros.fechaFin) {
            if (new Date(filtros.fechaInicio) > new Date(filtros.fechaFin)) {
                throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
            }
        }
        return {};
    }
};