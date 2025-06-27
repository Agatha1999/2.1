// Preguiça de documentar isso, mas as primeiras partes é o código que eu peguei junto da IA treinada

let modelo;

// Carrega o modelo Teachable Machine
async function carregarModelo() {
    modelo = await tf.loadLayersModel('model/model.json');
    console.log("Modelo carregado!");
}

// Analisa a imagem quando o usuário faz upload
document.getElementById('envio-arquivo').addEventListener('change', async (evento) => {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const previa = document.getElementById('previsualizacao-imagem');
    previa.src = URL.createObjectURL(arquivo);
    previa.style.display = 'block';

    const resultado = await preverImagem(arquivo);
    exibirResultado(resultado, previa.src); // Passa a URL da imagem

    document.getElementById('envio-arquivo').addEventListener('change', async (evento) => {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    // Pra não ficar o upload em cima da câmera aberta isso aqui fecha a câmera
    if (streamWebcam) {
        streamWebcam.getTracks().forEach(track => track.stop());
        streamWebcam = null;
    }
    const video = document.getElementById('video-webcam');
    video.style.display = 'none';
    document.getElementById('camera-botoes').style.display = 'none';

    const previa = document.getElementById('previsualizacao-imagem');
    previa.src = URL.createObjectURL(arquivo);
    previa.style.display = 'block';

    const resultado = await preverImagem(arquivo);
    exibirResultado(resultado, previa.src);
});

});


// Função para prever a imagem
async function preverImagem(arquivoImagem) {
    if (!modelo) await carregarModelo();

    // Carrega e processa a imagem
    const imagem = await carregarImagem(arquivoImagem);
    const tensor = tf.browser.fromPixels(imagem)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

    // Faz a previsão
    const previsoes = await modelo.predict(tensor).data();
    return previsoes;
}

// Carrega a imagem como um elemento HTMLImageElement
function carregarImagem(arquivo) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = URL.createObjectURL(arquivo);
    });
}

// Exibe o resultado
function exibirResultado(previsoes, imagemSrc = null) {
    const rotulos = ["Cravos", "Espinhas Brancas", "Pápulas", "Nódulos", "Cistos", "Fulminante"];
    const resultadoDiv = document.getElementById('resultado');
    
    const maiorPrevisao = Math.max(...previsoes);
    const indiceClassePrevista = previsoes.indexOf(maiorPrevisao);
    const classePrevista = rotulos[indiceClassePrevista];
    const confianca = (maiorPrevisao * 100).toFixed(2);

    const resultadoHTML = `
        <p><strong>Diagnóstico:</strong> ${classePrevista}</p>
        <p><strong>Confiança:</strong> ${confianca}%</p>
    `;

    resultadoDiv.innerHTML = resultadoHTML;
    
    // Adiciona ao histórico se vier de uma imagem
    if(imagemSrc) {
        adicionarAoHistorico(imagemSrc, resultadoHTML);
    }
}

// Carrega o modelo quando a página abre
carregarModelo();

let streamWebcam = null;

// Abrir a câmeraa
async function iniciarWebcam() {
    const video = document.getElementById('video-webcam');
    const previa = document.getElementById('previsualizacao-imagem');
    // De novo, para não ficar upload + camera, isso esconde a prévia de upload
    previa.style.display = 'none';
    // Solicita permissão pro navigator e inicia a webcam
    try {
        streamWebcam = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = streamWebcam;
        video.style.display = 'block';
        document.getElementById('camera-botoes').style.display = 'flex';
    } catch (err) {
        alert('Não foi possível acessar a câmera: ' + err);
        return;
    }
}


// Analisar a frame do vídeo
document.getElementById('btn-analisar').onclick = async function() {
    const imagemSrc = await capturarWebcam();
    const video = document.getElementById('video-webcam');
    
    // Pretendo fazer ele analisar em tempo real, mas n tenho tempoo, por enquanto vai ser frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 224;
    canvas.height = video.videoHeight || 224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tensor = tf.browser.fromPixels(imgData)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

    const previsoes = await modelo.predict(tensor).data();
    exibirResultado(previsoes, imagemSrc);
};

// Uma hora tem que fechar a câmera né :3
document.getElementById('btn-fechar').onclick = function() {
    const video = document.getElementById('video-webcam');
    const botoes = document.getElementById('botoes-webcam');
    const resultado = document.getElementById('resultado-webcam');
    if (streamWebcam) {
        streamWebcam.getTracks().forEach(track => track.stop());
        streamWebcam = null;
        document.getElementById('camera-botoes').style.display = 'none';
    }
    video.style.display = 'none';
    botoes.style.display = 'none';
    resultado.innerHTML = '';
};

// Fiz isso pra deixar mais completo... quero fazer ter mais detalhes
let historico = [];


// O site tem q saber que frame o user quer analisar, com essa função você pega o frame que quiser da câmera
async function capturarWebcam() {
    const video = document.getElementById('video-webcam');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

// Coloca o resultado, imagem e opção delete em cada registro
function adicionarAoHistorico(imagemSrc, resultadoHTML) {
    const item = document.createElement('div');
    item.className = 'diagnostico-item';
    
    item.innerHTML = `
        <img src="${imagemSrc}">
        <div class="diagnostico-conteudo">
            ${resultadoHTML}
        </div>
        <button class="botao-apagar">×</button>
    `;

    item.querySelector('.botao-apagar').addEventListener('click', () => {
        item.remove();
    });

    document.getElementById('lista-diagnosticos').prepend(item);
}

