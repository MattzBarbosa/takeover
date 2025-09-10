$(document).ready(function() {
    const today = new Date().toLocaleDateString();
    $('#dataOrcamento').text(today);

    $('#addItem').click(function() {
        let novoItem = $(".item-locacao:first").clone();
        novoItem.find("input").val("");
        $("#itensLocacao").append(novoItem);
    });

    $('#gerarOrcamento').click(function() {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        doc.setFontSize(12);

        // PRIMEIRA PÁGINA - Relatório de Locação
        const logo = new Image();
        logo.src = 'https://i.ibb.co/1fPZdrjp/LOGO-TKO-LOC.png';
        doc.addImage(logo, 'PNG', 80, 10, 50, 50);
        doc.setFontSize(10);
        doc.text("Take Over Filmes LTDA - 47.772.302/0001-41", 105, 60, { align: "center" });
        doc.text("Telefone / WhatsApp: +55 11 91614-0096 / contato@takeoverfilmes.com", 105, 65, { align: "center" });
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("ORÇAMENTO DE SERVIÇOS", 105, 75, { align: "center" });
        doc.setFont(undefined, 'normal');

        // Tabela com dados principais do orçamento
        doc.autoTable({
            head: [
                ["Orçamento Nº", "Cliente", "CNPJ", "Previsão de Entrega"]
            ],
            body: [
                [
                    $("#numeroOrcamento").val(),
                    $("#cliente").val(),
                    $("#cnpj").val(),
                    new Date($("#dataRetirada").val()).toLocaleDateString("pt-BR"),
                ]
            ],
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [132, 194, 211] },
            styles: { cellPadding: 2, fontSize: 10 }
        });

        doc.autoTable({
            head: [
                ["Contato", "Telefone", "E-mail"]
            ],
            body: [
                [
                    $("#contato").val(),
                    $("#telefone").val(),
                    $("#email").val()
                ]
            ],
            startY: doc.lastAutoTable.finalY + 2,
            theme: 'grid',
            headStyles: { fillColor: [132, 194, 211] },
            styles: { cellPadding: 2, fontSize: 10 }
        });

        // Tabela dos Itens Locados
        let items = [];
        $(".item-locacao").each(function() {
            items.push([
                $(this).find(".equipamento").val(),
                "R$ " + $(this).find(".valor").val()
            ]);
        });

        doc.autoTable({
            head: [
                ["Descrição"]
            ],
            body: items,
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [132, 194, 211] }
        });

        // Totalização
        let total = 0;
        $(".item-locacao").each(function() {
            let valor = parseFloat($(this).find(".valor").val()) || 0;
            total += valor;
        });

        doc.autoTable({
            head: [
                ["Valor"]
            ],
            body: [
                ["R$ " + total.toFixed(2).replace('.', ',')]
            ],
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'grid',
            headStyles: { fillColor: [132, 194, 211] },
            styles: { halign: 'right' },
            columnStyles: {
                0: { cellWidth: 40 } // largura da coluna
            },
            tableWidth: 'wrap', // ajusta a largura da tabela ao conteúdo
        });


        // Rodapé com informações adicionais
        doc.autoTable({
            body: [
                ["Dados para o pagamento: BANCO ITAU - Agência: 0375 - Conta: 99654-3 / PIX: 47.772.302/0001-41"]
            ],
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'grid',
            styles: { cellPadding: 2, fontSize: 10 },
            headStyles: { fillColor: [132, 194, 211] }
        });


        // SEGUNDA PÁGINA - Recibo de Locação
        doc.addPage();

        // Título da segunda página: RECIBO DE LOCAÇÃO + [Número do Orçamento]
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("RECIBO DE SERVIÇO" + $("#numeroOrcamento").val(), 105, 20, { align: "center" });
        doc.setFont(undefined, 'normal');

        // Prepara os dados para o recibo
        let reciboData = [
            ["Dados da TakeOver", "Take Over Filmes LTDA\nCNPJ: 47.772.302/0001-41\nTelefone/WhatsApp: +55 11 91614-0096\ncontato@takeoverfilmes.com"],
            ["Serviços", items.map(item => item.join(" - ")).join("\n")],
            ["Valor Total a Pagar", "R$ " + total.toFixed(2).replace('.', ',')],
            ["Previsão de Entrega", new Date($("#dataRetirada").val()).toLocaleDateString("pt-BR")],
            ["Dados de Pagamento", "BANCO ITAU - Agência: 0375 - Conta: 99654-3 / PIX: 47.772.302/0001-41"],
            ["Dados do Cliente", $("#cliente").val() + "\nCNPJ: " + $("#cnpj").val() + "\nContato: " + $("#contato").val() + "\nTelefone: " + $("#telefone").val() + "\nE-mail: " + $("#email").val() + "\nEndereço: " + $("#endereco").val()]
        ];

        doc.autoTable({
            head: [
                ["Campo", "Informação"]
            ],
            body: reciboData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [132, 194, 211] },
            styles: { cellPadding: 2, fontSize: 10 }
        });

        // Adiciona a assinatura em PNG abaixo da tabela do recibo
        const signature = new Image();
        signature.src = 'https://i.ibb.co/JWJ9YqyS/ass-victor-castro.png';
        let signatureY = doc.lastAutoTable.finalY + 10;
        // Posiciona a assinatura centralizada (largura 50)
        doc.addImage(signature, 'PNG', 105 - 25, signatureY, 50, 20);

        // Abaixo da assinatura, adiciona os campos de assinatura em texto
        doc.setFontSize(10);
        let textY = doc.lastAutoTable.finalY + 40;
        doc.text("___________________________", 105, textY, { align: "center" });
        doc.text("Victor Castro - CEO da Take Over Filmes LTDA.", 105, textY + 10, { align: "center" });

        doc.save("ORÇAMENTO-TAKEOVERLOC.pdf");
    });
});