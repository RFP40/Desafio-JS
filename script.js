const cliente = {
    nome: "Rafael",
    numeroConta: "1234-5",
    saldoDisponivel: 5000
}

const transferencia = [
    {
        destinatario: "Douglas",
        valorTransferencia: 200
    }
]

function realizarPix(destinatario, chavePix, tipoChave,valorTransferencia) {
    if (valorTransferencia <= 0) {
        return "Erro: o valor da transferencia deve ser positivo e maior que zero."
    }

    if (valorTransferencia > cliente.saldoDisponivel) {
        return "Erro: Não há saldo o suficiente para completar a transação"
    }

    cliente.saldoDisponivel -= valorTransferencia;

    const novaTransferencia = {
        destinatario: destinatario,
        valor: valorTransferencia
    };

    transferencia.push(novaTransferencia)

    return "Exito: transferencia feita com sucesso!"
}