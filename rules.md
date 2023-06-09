INTRODUÇÃO
Uma das funcionalidades que podemos oferecer em nossa integração é a possibilidade de consulta dos dados disponíveis no SCR de uma pessoa física ou jurídica via API. Com apenas uma solicitação de consulta enviada via request, a QI Tech se encarrega de enviar o pedido de autorização aos consultados, realizar a consulta (após autorizada) e despachar os resultados ao solicitante via webhook.

Além disso, para consultas PJ é possivel, com uma única solicitação, consultar a empresa e seus representantes, gerando uma consulta separa para cada um dos documentos.

Assim como as demais APIs a liberação do serviço deve ser feita junto ano nosso time e as chamadas são autenticadas.

Nas subseções abaixo veremos como executar uma consulta ao SCR.

FLUXO DE CONSULTA
O Fluxo de consulta ao SCR consiste em:

Solicitação da consulta (solicitado via request)
Assinatura da autorização da consulta pelo consultado ou os representantes (enviado via e-mail)
Realização da consulta (informado resultado via webhook)
Como pode ser visto, após uma única chamada de API o fluxo fica na mão da QI Tech até o fim, para manter controle da consulta é de extrema importância fazer o cadastro do seu endereço de callback.



SOLICITAÇÃO DE CONSULTA SCR
A API de SCR foi desenhada para ser executada em apenas uma requisição. O formato de assinatura do header e do body desta requisição é descrito em detalhes aqui.

REQUEST
PESSOA FÍSICA
endpoint: /scr
method: POST
body :
{
"person_type": "natural",
"name": "Joao Ninguem",
"document_number": "41184562067",
"email": "joao.ninguem@yopmail.com",
"report_start_date": "2019-02",
"report_end_date": "2020-03"
}

ATRIBUTOS DE UMA CONSULTA DE PESSOA FÍSICA
A consulta SCR para pessoa física consiste em:

Campo	Descrição	Exemplo
person_type	Tipo de pessoa a ser consultada. Neste caso SEMPRE "natural"	"natural"
name	Nome do consultado	"João Ninguem"
document_number	CPF do consultado	"42866592832"
email	E-mail do consultado	"joao.ninguem@yopmail.com"
report_start_date	Data de início da consulta (formato "AAAA-MM"). A data mínima disponível para consulta na QI Tech é 2019-02	"2019-02"
report_end_date	Data final da consulta (formato "AAAA-MM")	"2020-03"
**


PESSOA FÍSICA
endpoint: /scr
method: POST
body :
{
"person_type": "legal",
"name": "Padaria do Joao Ninguem",
"document_number": "05305188000108",
"signers": [
{
"name": "Diretor 1",
"document_number": "41184562067",
"email": "diretor1@email.com"
},
{
"name": "Diretor 2",
"document_number": "18631260070",
"email": "diretor2@email.com"
}
],
"report_start_date": "2019-02",
"report_end_date": "2020-03" ,
"check_representatives": true
}

ATRIBUTOS DE UMA CONSULTA DE PESSOA JURÍDICA
A consulta SCR para PJ consiste em:

Campo	Descrição	Exemplo
person_type	Tipo de pessoa a ser consultada. Neste caso SEMPRE "legal"	"legal"
name	Razão social	"Padaria do João Ninguem"
document_number	CNPJ do consultado	"05305188000108"
signers	Lista de signatários da empresa	Lista Signatários (descrito abaixo)
report_start_date	Data de início da consulta (formato "AAAA-MM"). A data mínima disponível para consulta na QI Tech é 2018-12	"2019-02"
report_end_date	Data final da consulta (formato "AAAA-MM"). Os dados do mês atual (ex. maio/2020) só são disponibilizados pelo Bacen após o 14º dia util do mês (junho/2020)	"2020-03"
check_representatives	Campo determinante para que haja a consulta dos representantes da empresa (booleano "true" ou "false", se omitido considera-se falso)	"true"

LISTA DE SIGNATÁRIOS
Esta lista, presente na consulta PJ, representa o conjunto de pessoas responsáveis pela empresa consultada e que irão assinar a autorização de consulta.

Campo	Descrição	Exemplo
name	Nome do signatário	"João Ninguem"
document_number	CPF do signatário	"41184562067"
email	E-mail do signatário	"joao.ninguem@yopmail.com"
Exemplo:

{
"signers": [
{
"name": "Diretor 1",
"document_number": "41184562067",
"email": "diretor1@email.com"
},
{
"name": "Diretor 2",
"document_number": "18631260070",
"email": "diretor2@email.com"
}
]
}

RESPONSE
A resposta desse pedido de consulta retornará a chave de indentificação da operação OPERATION_KEY e seu status, que será "pending_signature". No caso da consulta com representantes, uma mesma OPERATION_KEY representa as consultas da empresa e do representante.

status: 200
body (após ser decodado):

{
"webhook_type": "scr",
"key": OPERATION_KEY,
"status": "pending_signature",
"event_datetime": EVENT_DATE_TIME
}

WEBHOOKS
Após o envio de uma solicitação de consulta SCR com sucesso o resto do fluxo fica a cargo da QI Tech. O acompanhamento do resultado da operação é dado via Webhook seguindo o fluxo previamente estipulado. O padrão utilizado é: em caso de sucesso é enviado um webhook informando os dados da consulta, em caso de falha, um webhook é enviado informando que a solicitação foi rejeitada. Além disso o cliente pode escolher durante a contratação do serviço se os dados da consulta serão entregues apenas em pdf ou completo, que no caso retorna além do PDF todos os dados da consulta em JSON. Neste momento o cliente também recebe a chave individual da consulta scr SCR_KEY.

EM CASO DE SUCESSO TEMOS:
CONSULTA SOMENTE EM PDF:
{
"data": {
"consent_term": "https://urldasassinaturas.com/assinaturas.zip",    
"consulted_at": "2020-05-08",    
"created_at": "2020-05-08",   
"origin_key": OPERATION_KEY,  
"report_end_date": "2020-03",  
"report_start_date": "2019-02",    
"result_document": "https://urldodocumento.com/documento_consulta.pdf",   
"scr_key": SCR_KEY,  
"scr_status": "consulted",  
"signers": [
{
"document_number": "41184562067",      
"email": "joao.ninguem@yopmail.com",      
"name": "Joao Ninguem",
}
],
"subject_document_number": "41184562067",   
"subject_name": "Joao Ninguem",
"subject_person_type": "natural",
},
"webhook_type": "scr",
"event_datetime": EVENT_DATE_TIME,
"status": "consulted",
"key": OPERATION_KEY,
}

CONSULTA COMPLETA:
{
"data":{
"consent_term":"https://urldasassinaturas.com/assinaturas.zip",
"consulted_at":"2020-05-08",
"created_at":"2020-05-08",
"origin_key": OPERATION_KEY,
"report_end_date":"2020-03",
"report_start_date":"2019-02",
"result_document":"https://urldodocumento.com/documento_consulta.pdf",
"scr_key": SCR_KEY,
"scr_status":"consulted",
"scr_data":[
{
"reference_date":"2020-03",
"financial_institution_count":"3",
"operation_count":"10",
"assumed_coobligation":"10235",
"receive_coobligation":"23569",
"start_relationship":"2000-05-01",
"disagreement_operation_count":"2",
"disagreement_operation_value":"523",
"subjudice_operations_count":"1",
"subjudice_operations_value":"10000",
"indirect_risk":"200000",
"error":{
"error_code":"",
"description":"",
"error_type":""
},
"operation_items":[
{
"due_value": "46800",
"exchange_variation": "N",
"category_sub":{
"category":{
"category_code": 2,
"category_description": "Empréstimos"

                     },
                     "category_sub_code": 3,
                     "description": "crédito pessoal - sem consignação em folha de pagam."
                  },
                  "due_type":{
                      "due_type_group": "Vencido",
                      "due_code": "205",
                      "description": "Créditos vencidos de 1 a 14 dias",
                  }
               }
            ]
         }
      ],
      "signers":[
         {
            "document_number":"41184562067",
            "email":"joao.ninguem@yopmail.com",
            "name":"Joao Ninguem"
         }
      ],
      "subject_document_number":"41184562067",
      "subject_name":"Joao Ninguem",
      "subject_person_type":"natural"
},
"webhook_type":"scr",
"event_datetime": EVENT_DATE_TIME,
"status":"consulted",
"key": OPERATION_KEY
}

CONSULTA COM REPRESENTANTES:
{
"data":[
{
"consent_term":"https://urldasassinaturas.com/assinaturas.zip",
"consulted_at":"2020-08-12",
"created_at":"2020-08-12",
"origin_key": OPERATION_KEY,
"report_end_date":"2019-07",
"report_start_date":"2019-06",
"result_document":"https://urldodocumento.com/documento_consulta.pdf",
"scr_key": SCR_KEY,
"scr_status":"consulted",
"signed_at":"2020-08-12",
"signers":[
{
"document_number":"00152300074",
"email":"joao.ninguem@yopmail.com",
"name":"João Almeida"
}
],
"subject_document_number":"97381542000193",
"subject_name":"Beazini Pizzas",
"subject_person_type":"legal"
},
{
"consent_term":"https://urldasassinaturas.com/assinaturas.zip",
"consulted_at":"2020-08-12",
"created_at":"2020-08-12",
"origin_key":OPERATION_KEY,
"report_end_date":"2019-07",
"report_start_date":"2019-06",
"result_document":"https://urldodocumento.com/documento_consulta.pdf",
"scr_key":SCR_KEY,
"scr_status":"consulted",
"signed_at":"2020-08-12",
"signers":[
{
"document_number":"00152300074",
"email":"joao.ninguem@yopmail.com",
"name":"João Almeida"
}
],
"subject_document_number":"00152300074",
"subject_name":"João Almeida",
"subject_person_type":"natural"
}
],
"webhook_type":"scr",
"event_datetime":"EVENT_DATE_TIME",
"status":"consulted",
"key": OPERATION_KEY
}

EM CASO DE FALHA:
{
"data": {
"consent_term": null,    
"consulted_at": "2020-05-08",    
"created_at": "2020-05-08",   
"origin_key": OPERATION_KEY,  
"report_end_date": "2020-03",  
"report_start_date": "2019-02",    
"result_document": null,   
"scr_key": SCR_KEY,  
"scr_status": "rejected",  
"signers": [
{
"document_number":"41184562067",
"email":"joao.ninguem@yopmail.com",
"name":"Joao Ninguem"
}
],
"subject_document_number": "41184562067",   
"subject_name": "Joao Ninguem",
"subject_person_type": "natural",
},
"webhook_type": "scr",
"event_datetime": EVENT_DATE_TIME,
"status": "rejected",
"key": OPERATION_KEY,
}
