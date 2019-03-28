const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1');
require('dotenv').config();

//configura a API do Watson Assistant
const chatbot = new watson({
    'version': process.env.VERSION,
    'url':process.env.URL,
    'iam_apikey':  process.env.IAM_APIKEY,
    'iam_url': 'https://iam.bluemix.net/identity/token'
  });

  //configura o chatbot 
  var payload = {
    workspace_id: process.env.WORKSPACE_ID,
    context: {},
    input: {}
  };
  const workspace_id = process.env.WORKSPACE_ID;
  let fimDaConversa = false;

chatbot.message(payload, function trataResposta(err, resposta){
    if(err){
        console.log(err);
        return;
    }

    //detecta a intenção 
    if(resposta.intents.length > 0){
      console.log('Eu detectei a intenção: ' + resposta.intents[0].intent);
      if(resposta.intents[0].intent === 'despedida'){
        fimDaConversa = true;
      }
    }
    // exibe a resposta do dialogo,caso exista
    if(resposta.output.text.length > 0){
        console.log(resposta.output.text[0]);
    }


    if(!fimDaConversa){
      const mensagemUsuario = prompt('>>'); 
      chatbot.message(
      {
        workspace_id, 
        input: {'text': mensagemUsuario},
        context: resposta.context 
      },trataResposta)
    }
});
