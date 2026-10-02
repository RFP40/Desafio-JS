const cliente = {
    nome: "Carlos Oliveira",
    numeroConta: "1234-5",
    saldoDisponivel: 5000,

    alterarSaldo(valor) {
        this.saldoDisponivel -= valor;
    }
};


const transferencia = [];


// ==============================
// ELEMENTOS DO DOM
// ==============================

const nomeCliente = document.querySelector("#nomeCliente");
const saldoConta = document.querySelector("#saldoConta");
const ultimaAtividade = document.querySelector("#ultimaAtividade");

const formTransferencia = document.querySelector("#formTransferencia");

const tipoChave = document.querySelector("#tipoChave");
const chavePix = document.querySelector("#chavePix");
const valorTransferencia = document.querySelector("#valorTransferencia");

const mensagem = document.querySelector("#mensagem");

const listaTransferencias = document.querySelector("#listaTransferencias");
const estadoHistorico = document.querySelector("#estadoHistorico");
const quantidadeTransferencias = document.querySelector("#quantidadeTransferencias");

const ajudaChave = document.querySelector("#ajudaChave");


// ==============================
// CONFIGURAÇÕES INICIAIS
// ==============================

nomeCliente.textContent = cliente.nome;


// ==============================
// FACTORY FUNCTION
// ==============================

function criarTransferencia(destinatario, valorTransferencia, tipoChave) {
    return {
        destinatario: destinatario,
        valorTransferencia: valorTransferencia,
        tipoChave: tipoChave,
        data: new Date(),
        status: "APROVADA"
    };
}


// ==============================
// FORMATAÇÃO DA DATA
// ==============================

function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}


// ==============================
// ATUALIZAR SALDO NA INTERFACE
// ==============================

function atualizarSaldo() {
    saldoConta.textContent = cliente.saldoDisponivel.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ==============================
// MOSTRAR MENSAGEM
// ==============================

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;

    mensagem.classList.remove("success", "error");
    mensagem.classList.add(tipo);

    mensagem.hidden = false;
}


// ==============================
// ATUALIZAR HISTÓRICO
// ==============================

function atualizarHistorico() {

    listaTransferencias.innerHTML = "";

    const transferenciasAprovadas = transferencia.filter(
        transferenciaAtual => transferenciaAtual.status === "APROVADA"
    );

    if (transferenciasAprovadas.length === 0) {
        estadoHistorico.hidden = false;
    } else {
        estadoHistorico.hidden = true;
    }

    quantidadeTransferencias.textContent =
        `${transferenciasAprovadas.length} operação${transferenciasAprovadas.length !== 1 ? "ões" : ""}`;

    for (const {
        destinatario,
        valorTransferencia,
        tipoChave,
        data,
        status
    } of transferenciasAprovadas) {

        const item = document.createElement("article");
        item.classList.add("history-item");

        const partePrincipal = document.createElement("div");
        partePrincipal.classList.add("history-main");

        const chave = document.createElement("p");
        chave.classList.add("history-key");
        chave.textContent = `${tipoChave}: ${destinatario}`;

        const detalhes = document.createElement("p");
        detalhes.classList.add("history-meta");
        detalhes.textContent = `Realizada em ${formatarData(data)}`;

        const valor = document.createElement("span");
        valor.classList.add("history-value");
        valor.textContent = valorTransferencia.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        partePrincipal.appendChild(chave);
        partePrincipal.appendChild(detalhes);

        item.appendChild(partePrincipal);
        item.appendChild(valor);

        listaTransferencias.appendChild(item);
    }
}


// ==============================
// REALIZAR PIX
// ==============================

function realizarPix(destinatario, chavePix, tipoChave, valorTransferencia) {

    if (typeof destinatario !== "string") {
        throw new TypeError("O destinatário deve ser um texto.");
    }

    if (typeof chavePix !== "string") {
        throw new TypeError("A chave Pix deve ser um texto.");
    }

    if (typeof tipoChave !== "string") {
        throw new TypeError("O tipo da chave deve ser um texto.");
    }

    if (typeof valorTransferencia !== "number") {
        throw new TypeError("O valor da transferência deve ser um número.");
    }


    let chaveValida = false;

    switch (tipoChave) {

        case "CPF/CNPJ": {
            const chaveLimpa = chavePix.replace(/\D/g, "");

            if (chaveLimpa.length === 11 || chaveLimpa.length === 14) {
                chaveValida = true;
            }

            break;
        }

        case "EMAIL":
            if (chavePix.includes("@") && chavePix.includes(".")) {
                chaveValida = true;
            }

            break;

        case "CELULAR": {
            const chaveLimpa = chavePix.replace(/\D/g, "");

            if (chaveLimpa.length === 11) {
                chaveValida = true;
            }

            break;
        }

        case "ALEATORIA":
            if (chavePix.length === 32) {
                chaveValida = true;
            }

            break;

        default:
            throw new Error("Tipo de chave Pix inválido.");
    }


    if (!chaveValida) {
        throw new Error("Chave Pix inválida.");
    }

    if (valorTransferencia <= 0) {
        throw new Error(
            "O valor da transferência deve ser maior que zero."
        );
    }

    if (valorTransferencia > cliente.saldoDisponivel) {
        throw new Error(
            "Saldo insuficiente para realizar a transferência."
        );
    }


    cliente.alterarSaldo(valorTransferencia);

    const novaTransferencia = criarTransferencia(
        destinatario,
        valorTransferencia,
        tipoChave
    );

    transferencia.push(novaTransferencia);

    return "Transferência realizada com sucesso!";
}


// ==============================
// SUBMIT DO FORMULÁRIO
// ==============================

formTransferencia.addEventListener("submit", function (event) {

    event.preventDefault();

    try {

        const tipoChaveSelecionado = tipoChave.value;
        const chaveInformada = chavePix.value.trim();

        const valor = Number(valorTransferencia.value);


        // O HTML usa valores diferentes dos nossos cases.
        // Aqui fazemos a conversão.

        let tipoChaveFormatado;

        switch (tipoChaveSelecionado) {

            case "cpf_cnpj":
                tipoChaveFormatado = "CPF/CNPJ";
                break;

            case "email":
                tipoChaveFormatado = "EMAIL";
                break;

            case "celular":
                tipoChaveFormatado = "CELULAR";
                break;

            case "aleatoria":
                tipoChaveFormatado = "ALEATORIA";
                break;

            default:
                tipoChaveFormatado = "";
        }


        realizarPix(
            "Destinatário",
            chaveInformada,
            tipoChaveFormatado,
            valor
        );


        atualizarSaldo();
        atualizarHistorico();

        ultimaAtividade.textContent =
            `Transferência de ${valor.toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            )} realizada com sucesso.`;

        mostrarMensagem(
            "Transferência realizada com sucesso!",
            "success"
        );

        formTransferencia.reset();


    } catch (error) {

        // Durante o desenvolvimento:
        console.log(error.name);
        console.log(error.message);

        // Para o usuário:
        mostrarMensagem(
            "Não foi possível realizar a transferência. Verifique os dados e tente novamente.",
            "error"
        );

    } finally {

        console.log("Tentativa de transferência finalizada.");
    }
});


// ==============================
// ALTERAR AJUDA DA CHAVE
// ==============================

tipoChave.addEventListener("change", function () {

    switch (tipoChave.value) {

        case "cpf_cnpj":
            ajudaChave.textContent =
                "Informe um CPF ou CNPJ.";
            break;

        case "email":
            ajudaChave.textContent =
                "Informe um endereço de e-mail.";
            break;

        case "celular":
            ajudaChave.textContent =
                "Informe um celular com DDD.";
            break;

        case "aleatoria":
            ajudaChave.textContent =
                "Informe uma chave aleatória de 32 caracteres.";
            break;

        default:
            ajudaChave.textContent =
                "Escolha o tipo de chave para começar.";
    }
});


// ==============================
// INICIALIZAÇÃO
// ==============================

atualizarSaldo();
atualizarHistorico();