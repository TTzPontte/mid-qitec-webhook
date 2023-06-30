# QI Tech - Referência da API
Bem vindo à API de análise de crédito da QI Tech! Você pode utilizar a nossa API para acessar os endpoints, a fim de executar uma análise de crédito, além de utilizar para atualizar a situação de um crédito concedido.

Ao lado, você pode observar a implementação da API utilizando cUrl. Com isso você possui exemplos para poder adaptar adequadamente à linguagem de programação da sua preferência.

Problemas?
----------

Nós não somos uma companhia que se esconde atrás de uma API! Entre em contato com o nosso [suporte](mailto:%20suporte.caas@qitech.com.br) e nós responderemos o mais rápido possível. Fique à vontade para nos ligar caso deseje uma resposta rápida!

### Adoramos Feedback

Mesmo que você já tenha resolvido o seu problema ou que ele seja muito simples (Até mesmo um typo ou uma organização inadequada que você já entendeu), envie-nos um e-mail, assim nós tornamos a documentação cada vez mais prática e a próxima pessoa não vai precisar sofrer as dores que você sofreu!

Ambientes
---------

Possuímos dois ambientes para os nossos clientes. A URL base das APIs são:

*   Produção - `https://api.caas.qitech.app/credit_analysis/`
*   Sandbox - `https://api.sandbox.caas.qitech.app/credit_analysis/`

No ambiente de Sandbox, as análises enviadas não são cobradas, são respondidas de acordo com regras pré estabelecidas e retornam dados fictícios, com o intuito exclusivo simular o ambiente de produção parap auxiliar o cliente no momento da integração.

Para a análise de uma operação de crédito, no ambiente de Sandbox, a decisão é aplicada sobre o valor total do crédito (`financial.amount`) a ser concedido, de acordo com a tabela abaixo:


|Mínimo|Máximo|Decisão                                                                      |
|------|------|-----------------------------------------------------------------------------|
|10001 |-     |Reprovado                                                                    |
|8001  |10000 |Análise Manual - Um webhook de reprovação manual é enviado após 1 minuto     |
|6001  |8000  |Análise Manual - Um webhook de aprovação manual é enviado após 1 minuto      |
|4001  |6000  |Aguardando Dados - Um webhook de aprovação automática é enviado após 1 minuto|
|2001  |4000  |Pendente                                                                     |
|0     |2000  |Aprovado                                                                     |


Somente HTTPS
-------------

Por questão de segurança, toda a comunicação com as APIs da Zaig devem ser realizadas utilizando a comunicação HTTPS. Para garantir que, por desatenção ou qualquer outro motivo, não ocorram chamadas HTTP, este servidor somente disponibiliza a porta 443 com comunicação TLS 1.2. Chamadas realizadas utilizando outros protocolos serão automaticamente negadas.

Autenticação
------------

> Para autenticar uma chamada, utilize o código seguinte:

```
# No shell, você somente precisa adicionar o header adequado em cada requisição
curl "api_endpoint_here"
  -H "Authorization: EXAMPLE-OF-API-KEY"

```


> Substitua a API key 'EXAMPLE-OF-API-KEY' com a sua chave adquirida com o nosso suporte.

Utilizamos uma API Key para permitir acesso a nossa API. Ela provavelmente já foi enviada por e-mail para você. Caso você ainda não tenha recebido a sua chave, envie um e-mail para [suporte.caas@qitech.com.br](mailto:suporte.caas@qitech.com.br).

Nossa API espera receber a API Key em todas as requisições ao nosso servidor em um header como o abaixo:

`Authorization: EXAMPLE-OF-API-KEY`

O processo de análise de crédito consiste em enviar uma requisição, tanto de **NaturalPerson** como de **LegalPerson** no respectivo endpoint e esperar a resposta.

Após a QI Tech realizar a análise de crédito, ela retornará uma resposta com um status referente a análise. Esse status tem o nome de **analysis\_status**, que representa o resultado da analise de crédito realizado pela QI Tech.

Além do **analysis\_status** a QI Tech também possui o **credit\_proposal\_status** que tem como objetivo representar o status do crédito analisado em cada momento de sua vida na sua plataforma.

**analysis\_status**
--------------------

Conforme descrito anteriormente, a QI Tech possui sete **analysis\_status** que indicam o status da decisão da análise de crédito e possui uma máquina de estados bastante simples:



* analysis_status: automatically_approved
  * Descrição: Os algoritmos da QI Tech recomendam que este cadastro seja aprovado
* analysis_status: automatically_reproved
  * Descrição: Os algoritmos da QI Tech recomendam que este cadastro seja reprovado
* analysis_status: in_manual_analysis
  * Descrição: Os algoritmos da QI Tech enviaram este cadastro para a análise manual
* analysis_status: manually_approved
  * Descrição: Após análise manual, o analista decidiu aprovar o cadastro
* analysis_status: manually_reproved
  * Descrição: Após análise manual, o analista decidiu reprovar o cadastro
* analysis_status: waiting_for_data
  * Descrição: A análise de crédito está aguardado o retorno de alguma informação de bureau ou provedor de dados e será respondido por meio de Webhook
* analysis_status: automatically_challenged
  * Descrição: Os algoritmos da QI Tech recomendam que este cadastro seja desafiado
* analysis_status: manually_challenged
  * Descrição: Após análise manual, o analista decidiu desafiar o cadastro
* analysis_status: pending
  * Descrição: A análise de crédito está demorando mais do que o esperado, este cadastro entrou em uma fila de análise automática e será respondido por meio de Webhook


**credit\_proposal\_status**
----------------------------

O **credit\_proposal\_status** indica o status da operação do cliente, ou seja, o status da proposta de crédito na sua empresa ou plataforma. Os seguintes enumeradores existem para este status:


|credit_proposal_status|Descrição                                               |
|----------------------|--------------------------------------------------------|
|created               |A proposta de crédito foi criada na sua plataforma      |
|disbursed             |O proposta de crédito foi desembolsada na sua plataforma|
|paid                  |O cliente realizou o pagamento integral do crédito      |
|defaulted             |O cliente está inadimplente na sua plataforma           |


Para realizar a análise de crédito de uma pessoa física, utilize o endpoint de NaturalPerson.

No momento em que uma análise de crédito de pessoa física for realizada, os seguintes dados abaixo devem ser enviados para o nosso servidor.

Definição do Objeto Natural Person
----------------------------------

> Exemplo Pessoa Física

```
{
  "id": "678",
  "registration_id":"444",
  "credit_request_date": "2021-03-31T10:30:00-03:00",
  "credit_type": "student_loan",
  "name": "Victor Silva Barbosa",
  "document_number": "199.208.915-92",
  "birthdate": "1990-01-01",
  "email": "exemplo@sample.com",
  "nationality": "BRA",
  "gender": "male",
  "mother_name": "Ana Barbosa",
  "father_name": "João Silva",
  "monthly_income": 30000,
  "declared_assets": 7500000,
  "occupation": "pedagogy",
  "address": {
    "country": "BRA",
    "street": "Rua Curitiba",
    "number": "150",
    "complement": "Bl 3 apt 122",
    "neighborhood": "Paraíso",
    "city": "São Paulo",
    "uf": "SP",
    "postal_code": "04005-030"
  },
  "phones": [
    {
      "international_dial_code": "55",
      "area_code": "11",
      "number": "32234611",
      "type": "residential"
    }
  ],
  "guarantors": [
    {
      "name": "Melissa Lima Melo",
      "document_number": "677.498.846-61",
      "birthdate": "1960-11-21",
      "email": "exemplo2@sample.com",
      "nationality": "BRA",
      "mother_name": "Raíssa Lima",
      "father_name": "Ronaldo Melo",
      "monthly_income": 800000,
      "declared_assets": 18600000,
      "occupation": "law",
      "gender": "female",
      "address": {
        "country": "BRA",
        "street": "Rua Castro Alves",
        "number": "100",
        "complement": "Ap 202",
        "neighborhood": "Parque Estrela Dalva I",
        "city": "Luziânia",
        "uf": "GO",
        "postal_code": "72804-050"
      },
      "phones": [
        {
          "international_dial_code": "55",
          "area_code": "11",
          "number": "21158745",
          "type": "residential"
        }
      ]
    }
  ],
  "financial": {
    "amount": 100000,
    "currency": "BRL",
    "interest_type": "cdi_plus",
    "annual_interest_rate": 2.32,
    "cdi_percentage": 100,
    "number_of_installments": 4
  },
  "warrants": [
    {
      "warrant_type": "real_estate",
      "address": {
        "country": "BRA",
        "street": "Rua Curitiba",
        "number": "150",
        "complement": "Bl 3 apt 122",
        "neighborhood": "Paraíso",
        "city": "São Paulo",
        "uf": "SP",
        "postal_code": "04005-030"
      },
      "property_type": "house",
      "estimated_value": 100000000,
      "forced_selling_value": 60000000
    }
  ],
  "source": {
    "channel": "website",
    "ip": "145.25.145.32",
    "session_id": "bec256b3-5265-4dcb-bc55-2e4fb43983e0"
  },
  "scr_parameters" : {
    ...
  }
}

```


Uma análise de crédito deve ser enviada para a API antes do desembolso e pode ser utilizada para se tomar a decisão de conceder ou não o crédito. Os dados enviados também podem, mediante acordo com o cliente, ser utilizados para a prevenção a fraudes.

Os objetos utilizados na composição do objeto **CreditProposal** e não definidos nesta seção estão disponíveis na seção [Objetos Compartilhados](#objetos-compartilhados).


|nome                  |tipo   descrição|
|----------------------|----------------|
|id                    |string          |
|registration_id       |string          |
|credit_request_date   |datetime        |
|credit_type           |enum            |
|name                  |string          |
|document_number       |string          |
|birthdate             |date            |
|gender                |enum            |
|nationality           |string          |
|mother_name           |string          |
|father_name           |string          |
|monthly_income        |integer         |
|declared_assets       |integer         |
|client_category       |string          |
|client_since          |date            |
|occupation            |string          |
|email                 |string          |
|documents             |Document        |
|address               |Address         |
|phones                |Lista de Phones |
|guarantors            |list of Person  |
|financial.amount      |integer         |
|financial.currency    |enum            |
|interest_type         |enum            |
|annual_interest_rate  |number          |
|cdi_percentage        |number          |
|number_of_installments|integer         |
|warrants              |Warrant         |
|source                |Source          |
|scr_parameters        |ScrParameters   |


Enviar uma Proposta de Crédito - Pessoa Física
----------------------------------------------

> Exemplo de Request

> Exemplo de Retorno

```
{
  "id": "12345",
  "analysis_status": "automatically_approved"
}

```


Para realizar a avaliação de uma proposta de crédito, basta enviar um objeto do tipo **NaturalPerson** ao seguinte endpoint:

`POST https://api.caas.qitech.app/credit_analysis/natural_person`

Para realizar a análise de crédito de uma pessoa jurídica, utilize o endpoint de Legal Person.

No momento em que uma análise de crédito de pessoa jurídica for realizada, os seguintes dados deverão ser enviados para o nosso servidor.

Definição do Objeto Legal Person
--------------------------------

> Exemplo Pessoa Jurídica

```
{
  "id": "855",
  "credit_request_date": "2021-03-31T10:30:00-03:00",
  "credit_type": "student_loan",
  "legal_name": "Zaig Tecnologia LTDA",
  "trading_name": "Zaig",
  "document_number": "35.472.523/0001-15",
  "constitution_date": "2019-11-11",
  "constitution_type": "llc",
  "email": "suporte.caas@qitech.com.br",
  "monthly_revenue": 50000000,
  "client_category": "Premium User",
  "client_since": "2021-02-11",
  "address": {
    "country": "BRA",
    "street": "Av. Brigadeiro Faria Lima",
    "number": "2391",
    "neighborhood": "Jardim Paulistano",
    "city": "São Paulo",
    "uf": "SP",
    "postal_code": "01452-905"
  },
  "phones": [
    {
      "international_dial_code": "55",
      "area_code": "11",
      "number": "32234611",
      "type": "residential"
    }
  ],
  "shareholders": [
    {
      "name": "Anna Pinto Azevedo",
      "document_number": "261.026.462-31",
      "birthdate": "1972-08-22",
      "email": "annapintoazevedo@sample.com",
      "nationality": "BRA",
      "mother_name": "Beatrice Rodrigues Pinto",
      "father_name": "Luís Azevedo",
      "monthly_income": 800000,
      "declared_assets": 18600000,
      "occupation": "law",
      "gender": "female",
      "address": {
        "country": "BRA",
        "street": "Rua Derviche Djouki",
        "number": "598",
        "complement": "Ap 857",
        "neighborhood": "Chora Menino",
        "city": "São Paulo",
        "uf": "SP",
        "postal_code": "02463-080"
      },
      "phones": [
        {
          "international_dial_code": "55",
          "area_code": "11",
          "number": "55988644",
          "type": "mobile"
        }
      ]
    }
  ],
  "guarantors": [
    {
      "name": "Melissa Lima Melo",
      "document_number": "677.498.846-61",
      "birthdate": "1960-11-21",
      "email": "exemplo2@sample.com",
      "nationality": "BRA",
      "mother_name": "Raíssa Lima",
      "father_name": "Ronaldo Melo",
      "monthly_income": 800000,
      "declared_assets": 18600000,
      "occupation": "law",
      "gender": "female",
      "address": {
        "country": "BRA",
        "street": "Rua Castro Alves",
        "number": "100",
        "complement": "Ap 202",
        "neighborhood": "Parque Estrela Dalva I",
        "city": "Luziânia",
        "uf": "GO",
        "postal_code": "72804-050"
      },
      "phones": [
        {
          "international_dial_code": "55",
          "area_code": "11",
          "number": "21158745",
          "type": "residential"
        }
      ]
    }
  ],
  "financial": {
    "amount": 100000,
    "currency": "BRL",
    "interest_type": "cdi_plus",
    "annual_interest_rate": 2.32,
    "cdi_percentage": 100,
    "number_of_installments": 4
  },
  "warrants": [
    {
      "warrant_type": "real_estate",
      "address": {
        "country": "BRA",
        "street": "Rua Curitiba",
        "number": "150",
        "complement": "Bl 3 apt 122",
        "neighborhood": "Paraíso",
        "city": "São Paulo",
        "uf": "SP",
        "postal_code": "04005-030"
      },
      "property_type": "house",
      "estimated_value": 100000000,
      "forced_selling_value": 60000000
    }
  ],
  "source": {
    "channel": "website",
    "ip": "132.23.161.75",
    "session_id": "2bb684f9-6c00-4993-bcd7-18b9eccd7c9d"
  },
  "scr_parameters" : {
    ...
  }
}

```


Uma análise de crédito deve ser enviada para a API antes do desembolso e pode ser utilizada para se tomar a decisão de conceder ou não o crédito. Os dados enviados também podem, mediante acordo com o cliente, ser utilizados para a prevenção a fraudes.

Os objetos utilizados na composição do objeto CreditProposal e não definidos nesta seção estão disponíveis na seção [Objetos Compartilhados](#objetos-compartilhados).



* nome: id
  * tipo: string
  * descrição: Identificador da proposta de crédito no seu sistema.  É essencial que este número seja único para cada processo de análise de crédito
* nome: registration_id
  * tipo: string
  * descrição: Identificador do cadastro no sistema do cliente. Para realizar mais de uma análise referente a um mesmo cadastro,
* nome: credit_request_date
  * tipo: datetime
  * descrição: A data e hora quando o crédito foi requisitado pelo tomador
* nome: credit_type
  * tipo: enum
  * descrição: Tipo de crédito sendo concedido. No momento são suportados: clean, student_loan, credit_card_limit
* nome: legal_name
  * tipo: string
  * descrição: Razão social
* nome: trading_name
  * tipo: string
  * descrição: Nome fantasia
* nome: document_number
  * tipo: string
  * descrição: O CNPJ, formatado conforme padrão estabelecido nesta documentação
* nome: monthly_revenue
  * tipo: integer
  * descrição: Receita mensal bruta em centavos
* nome: client_category
  * tipo: string
  * descrição: Categoria do cliente de acordo com a classificação da sua plataforma ou seu programa de fidelidade
* nome: client_since
  * tipo: date
  * descrição: Data de início da prestação de serviços para este cliente
* nome: constitution_date
  * tipo: data
  * descrição: A data de constituição da companhia, conforme junta comercial
* nome: constitution_type
  * tipo: enum
  * descrição: O tipo de constituição da empresa: LLC, corp
* nome: email
  * tipo: string
  * descrição: O email do representante da empresa
* nome: address
  * tipo: Address
  * descrição: O endereço da matriz da companhia
* nome: phones
  * tipo: list of Phones
  * descrição: Os telefones colhidos da companhia
* nome: shareholders
  * tipo: list of NaturalPerson
  * descrição: Os sócios da companhia, no modelo de pessoa física (Objeto NaturalPerson)
* nome: guarantors
  * tipo: list of Person
  * descrição: Garantidores da operação, Pessoa física (NaturalPerson) ou jurídica (LegalPerson)
* nome: financial.amount
  * tipo: integer
  * descrição: O valor total sendo requerido pelo tomador, que será liberado em caso de aprovação
* nome: financial.currency
  * tipo: enum
  * descrição: A unidade monetária referente ao valor total: BRL, USD, EUR
* nome: interest_type
  * tipo: enum
  * descrição: O indexador da dívida que será utilizado: cdi_plus, cdi_percentage, price, pre_fixed
* nome: annual_interest_rate
  * tipo: number
  * descrição: O valor da parte pré-fixada do juros, em percentual ao ano
* nome: cdi_percentage
  * tipo: number
  * descrição: O percentual do CDI (Pós) do juros a ser cobrado
* nome: number_of_installments
  * tipo: integer
  * descrição: Número de parcelas
* nome: warrants
  * tipo: Warrant
  * descrição: Dados de garantias reais oferecidas na operação. Deverá ser acordada antes da entrada em produçao. Atualmente os seguintes tipos são aceitos: real_estate
* nome: source
  * tipo: Source
  * descrição: O canal de venda do crédito. Atualmente são aceitos: website e app
* nome: scr_parameters
  * tipo: ScrParameters
  * descrição: Objeto com as informações necessárias para a utilização das informações do SCR na análise de crédito


Enviar uma Proposta de Crédito - Pessoa Jurídica
------------------------------------------------

> Exemplo de Request

> Exemplo de Retorno

```
{
  "id": "12345",
  "analysis_status": "automatically_approved"
}

```


Para realizar a avaliação de uma proposta de crédito, basta enviar um objeto do tipo LegalPerson ao seguinte endpoint:

`POST https://api.caas.qitech.app/credit_analysis/legal_person`

Caso o cliente contrate, temos a opção da utilização dos dados disponíveis no SCR da pessoa física ou jurídica no momento da análise de crédito. Para utilização dos dados do SCR, é primordial que o consentimento do consultado seja coletado. Esse consentimento pode ser coletado pela QI Tech ou pelo próprio cliente e isso influencia no fluxo de consentimento, bem como nos dados que devem ser enviados para a API, conforme abaixo:

**1\. Coleta de consentimento via QITech -** Caso opte pela coleta do consentimento via QI Tech, um link para assinatura eletrônica é enviado diretamente, via e-mail, da QI Tech para o usuário consultado e, quando o usuário assina o link e finaliza o processo, a informação do SCR automaticamente torna-se disponível para uso. Para utilização deste fluxo, é necessário que, na integração, sejam enviados os dados do usuário final que irá assinar o termo de consentimento.

**2\. Coleta do consentimento pelo próprio cliente -** É possível coletar a assinatura do termo de consentimento em seu próprio ambiente ou esteira de crédito (pode ser feito por documento assinado ou opt-in box do termo). Para que isso seja possível, o termo de consentimento utilizado deve ser validado pelo time jurídico da QI Tech e se faz necessário o envio de informações que comprovem de maneira auditável que o consentimento para acesso à informação de SCR foi coletado através do objeto _scr\_parameters_.

Coleta do Consentimento via QITech - Pessoa Física
--------------------------------------------------

No caso de uma pessoa física, para que a QI Tech envie o pedido de consentimento, basta o preenchimento dos dados pessoais do consultado no objeto de `CreditProposal`. Com isso, a QI Tech irá enviar o pedido de consentimento ao consultado via e-mail e, automaticamente, realizar a consulta (após autorizaçao), disponibilizando os resultados para análise de crédito.

Coleta do Consentimento via QITech - Pessoa Jurídica
----------------------------------------------------

```

  {
    "id": "32199d0s",
    "legal_name": "QI CAAS LTDA",
    "trading_name": "QI Tech",
    ...
    "scr_parameters": {
      "signers": [
        {
          "document_number": "372.989.950-30",
          "name": "Felipe Marques da Silva",
          "email": "felipe.silva@qitech.com.br",
          "phone": {
            "number": "991722315",
            "area_code": "16",
            "international_dial_code": "55"
          }
        },
        {
          "document_number": "440.896.050-08",
          "name": "Claudio Mattos",
          "email": "claudiomattos@sample.com",
          "phone": {
            "number": "991722315",
            "area_code": "16",
            "international_dial_code": "55"
          }
        }
      ]
    }
  }

```


No caso de uma pessoa jurídica, para que a QI Tech envie o pedido de consentimento, é necessário incluir o objeto adicional `scr_parameters` na requisição de análise. Dentro deste objeto, será necessário adicionar a lista de responsáveis legais da empresa para os quais serão enviados os pedidos de assinatura eletrônica via e-mail. Essa lista deve ser enviada dentro da propriedade `signers`. Após a assinatura de todos os representantes legais, a QI Tech realizará a consulta, disponibilizando os resultados para análise de crédito. Ao lado temos um exemplo do objeto `scr_parameters` para o caso descrito.

Coleta do Consentimento pelo Próprio Cliente - Pessoa Física
------------------------------------------------------------

```
  {
    "id": "678",
    "credit_request_date": "2021-03-31T10:30:00-03:00",
    "credit_type": "student_loan",
    "name": "Victor Silva Barbosa",
    "document_number": "199.208.915-92",
    ...
    "scr_parameters": {
      "signature_evidence": {
        "ip_address": "179.104.42.245",
        "session_id": "ddb1d063-4fdf-4330-af9c-3316e9142ff3",
        "access_token":         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36PO6yJV_adQssw5d",
        "additional_data": {
          ...
        },
        "signed_term": {
          "raw_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum erat et tempus dapibus. Donec eu sapien tortor. Pellentesque et tortor eget erat pulvinar mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ornare diam arcu, sit amet auctor lorem varius quis. Ut pretium venenatis magna sed ultrices. Donec quis tortor odi."
        }
      }
    }
  }

```


No caso de uma pessoa física, quando a coleta do consentimento é realizada pelo cliente, é necessário incluir o objeto adicional `scr_parameters` na requisição de análise. Dentro deste objeto, é necessário adicionar informações para comprovar que a pessoa analisada autorizou a consulta. Essas informações devem ser enviadas dentro da propriedade `signature_evidence`. Ao lado temos um exemplo do objeto `scr_parameters` para o caso descrito.

Coleta do Consentimento pelo Próprio Cliente - Pessoa Jurídica
--------------------------------------------------------------

```
  {
    "id": "678",
    "credit_request_date": "2021-03-31T10:30:00-03:00",
    "credit_type": "student_loan",
    "name": "Victor Silva Barbosa",
    "document_number": "199.208.915-92",
    ...
    "scr_parameters": {
      "signers": [
        {
          "document_number": "372.989.950-30",
          "name": "Felipe Marques da Silva",
          "email": "felipe.silva@qitech.com.br",
          "phone": {
            "number": "991722315",
            "area_code": "16",
            "international_dial_code": "55"
          }
        },
        {
          "document_number": "440.896.050-08",
          "name": "Claudio Mattos",
          "email": "claudiomattos@sample.com",
          "phone": {
            "number": "991722315",
            "area_code": "16",
            "international_dial_code": "55"
          }
        }
      ],
      "signature_evidence": {
        "ip_address": "179.104.42.245",
        "session_id": "ddb1d063-4fdf-4330-af9c-3316e9142ff3",
        "access_token":         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36PO6yJV_adQssw5d",
        "additional_data": {
          ...
        },
        "signed_term": {
          "raw_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum erat et tempus dapibus. Donec eu sapien tortor. Pellentesque et tortor eget erat pulvinar mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ornare diam arcu, sit amet auctor lorem varius quis. Ut pretium venenatis magna sed ultrices. Donec quis tortor odi."
        }
      }
    }
  }

```


No caso de uma pessoa jurídica, quando a coleta do consentimento é realizada pelo cliente, é necessário incluir o objeto adicional `scr_parameters` na requisição de análise. Dentro deste objeto, é necessário adicionar informações para comprovar que a pessoa analisada autorizou a consulta, bem como adicionar a lista de responsáveis legais da empresa que autorizaram a consulta. As informações de autorização deverão ser enviadas dentro da propriedade `signature_evidence` e a lista de pssoas que autorizaram a consulta dentro da propriedade `signers`. Ao lado temos um exemplo do objeto `scr_parameters` para o caso descrito.

Atualizar o status de uma CreditProposal
----------------------------------------

> Corpo da requisição - Para marcar o crédito como concedido

```
{
  "credit_proposal_status": "disbursed",
  "event_date": "2021-11-05T13:34:12-03:00"
}

```


Para garantir a retroalimentação das regras e do modelo de inteligência artificial implementado, é necessário informar ao sistema quando as operações são efetivadas. Para isso, requisições com o método PUT devem ser utilizadas, autenticadas normalmente:

*   **Natural Person:**

`PUT https://api.caas.qitech.app/credit_analysis/natural_person/123456`

*   **Legal Person:**

`PUT https://api.caas.qitech.app/credit_analysis/legal_person/123456`

É possível, após a execução da análise, ter como decisão desafiar o usuário para realizar uma nova ação em sua plataforma. Esse fluxo pode ser utilizado para, por exemplo, solicitar um comprovante de renda para um usuário que ainda não se tem certeza que deve ser aprovado ou reprovado na análise de crédito.

Há duas possibilidades de utilização deste fluxo, um deles de maneira automática, e outra fruto da decisão manual de um analista. Para o primeiro, o _analysis\_status_ retornado será _automatically\_challenged_ e para o segundo será _manually\_challenged_. Abaixo temos a descrição do fluxo.

Passo-a-passo da execução do fluxo
----------------------------------

**1.** Proposta é submetida para análise (ver seção [Análise de Crédito - Pessoa Física](#natural_person) ou [Análise de Crédito - Pessoa Jurídica](#legal_person)), e retornará o status _automatically\_challenge_ ou _in\_manual\_analysis_.

> Exemplo de Payload de Envio:

```
{
  "id": "12345",
  "registration_id":"12345",
  "credit_request_date": "2021-03-31T10:30:00-03:00",
  "credit_type": "clean",
  "name": "Victor Silva Barbosa",
  "document_number": "199.208.915-92",
  ...
}

```


> Exemplo de Payload de Resposta

```
{
  "id": "12345",
  "analysis_status": "automatically_challenge"
}

```


Caso a requisição retorne na resposta o status de _in\_manual\_analysis_, o analista poderá, através da dashboard, desafiar o usuário. Neste caso o status que será enviado na requisição de webhook é _manually\_challenged_.

> Exemplo de Payload de Resposta

```
{
  "id": "12345",
  "analysis_status": "manually_challenged"
}

```


**2.** Após a primeira requisição de análise ter retornado um dos dois _analysis\_status_ de desafio, uma nova requisição deverá ser enviada com as informações adicionais coletadas do cliente, como por exemplo, uma novo imagem de documento enviada. Esta requisição deve conter o mesmo _registration\_id_ da requisição anterior, uma vez que este campo será utilizado para que a plataforma identifique que ambas as requsições se referem ao mesmo usuário, bem como vincular as informações adicionais coletadas do cliente.

> Exemplo de Payload de Envio com informações adicionais

```
{
  "id": "67890",
  "registration_id":"12345",
  "credit_request_date": "2021-03-31T10:30:00-03:00",
  "credit_type": "clean",
  "name": "Victor Silva Barbosa",
  "document_number": "199.208.915-92",
  "documents": {    
    "cnh": {
      "ocr_key":"a5cf9c8f-2f66-4490-a7db-8a5bc70c1b76"
    }
  }
  ...
}

```


> Exemplo de Payload de Resposta

```
{
  "id": "12345",
  "analysis_status": "automatically_approved"
}

```


Abaixo as definições de outros objetos utilizados ao longo da documentação.

Objeto _Address_
----------------

> Exemplo

```
{
  "street": "Rua do Exemplo",
  "number": "111" ,
  "neighborhood": "Bairro do Teste",
  "city": "Aparecida de Goiânia",
  "uf": "GO",
  "complement": "Apt 903",
  "postal_code": "00000-000"
}

```


O objeto _Address_ é utilizado para representar endereços em toda a API, endereços no território brasileiro são representados da seguinte maneira:



* nome: street
  * tipo: string
  * descrição: Rua do endereço, incluindo o logradouro, evitando, se possível, abreviações.
* nome: number
  * tipo: string
  * descrição: Número do imóvel, incluindo letras caso possua.
* nome: neighborhood
  * tipo: string
  * descrição: Bairro, sem abreviações. e.g.: Santa Felicidade
* nome: city
  * tipo: string
  * descrição: Nome completo da cidade, sem abreviações
* nome: uf
  * tipo: string
  * descrição: A unidade federativa, com duas letras maiúsculas. e.g.: SP
* nome: complement
  * tipo: string
  * descrição: Quaisquer complementos para localizar o imóvel. e.g.: Apartamento 101, Conjunto 12
* nome: postal_code
  * tipo: string
  * descrição: O código postal da localidade, contendo o hífen.
* nome: country
  * tipo: string
  * descrição: Código ISO 3166-1 alfa-3 do país do endereço.


No caso dos endereços cujo país não seja Brasil ("BRA"), o postal\_code e a unidade federativa poderão ser preenchidos livremente.

Objeto _Phone_
--------------

> Exemplo

```
{
  "international_dial_code": "1",
  "area_code": "11",
  "number": "999999999",
  "type": "mobile"
}

```


Um objeto _Phone_ representa um número telefônico, dentro ou fora do Brasil e sua classificação. Para isso, os campos são:


|nome                   |tipo  |descrição                                                       |
|-----------------------|------|----------------------------------------------------------------|
|international_dial_code|string|Código de discagem internacional, sem zero ou +, somente números|
|area_code              |string|Código de área, sem zero, somente números                       |
|number                 |string|Número do telefone, sem o hífen                                 |
|type                   |enum  |Tipo de número: celular, residencial, comercial, etc.           |


Existem os seguintes enumeradores para tipo de telefone: `residential`, `commercial`, `mobile`

Objeto _cnh_
------------

> Exemplo

```
{
  "register_number": "05163811694",
  "issuer_state": "PR",
  "first_issuance_date":"2011-03-21",
  "issuance_date":"2016-06-29",
  "expiration_date":"2021-06-25",
  "category": "AB",
  "validation_type":"zaig_sdk",
  "ocr_key":"a5cf9c8f-2f66-4490-a7db-8a5bc70c1b76"
}

```


O objeto _cnh_ é utilizado para representar as CNHs em toda a API bem como se foi utilizado algum meio de validação dos mesmos. Eles são representados da seguinte maneira:


|nome               |tipo  |descrição                                                   |
|-------------------|------|------------------------------------------------------------|
|register_number    |string|Número do registro da CNH cadastrada.                       |
|issuer_state       |enum  |Enumerador do estado onde a CNH foi emitida                 |
|first_issuance_date|date  |Data de primeira habilitação.                               |
|issuance_date      |date  |Data de emissão                                             |
|expiration_date    |date  |Data de vencimento                                          |
|category           |enum  |Categoria da CNH em letras maiúsculas                       |
|validation_type    |enum  |Tipo de validação utilizada durante o cadastro do documento.|
|ocr_key            |guid  |Id retornado pela API de validação de documento da Zaig.    |


Existem os seguintes enumeradores para _validation\_type_: `zaig_api` e `zaig_sdk`.

Objeto _rg_
-----------

> Exemplo

```
{
  "number": "4.366.477-8",
  "issuer": "II",
  "issuer_state": "PR",
  "issuance_date":"2002-01-12",
  "validation_type":"zaig_sdk",
  "ocr_front_key":"a5cf9c8f-2f66-4490-a7db-8a5bc70c1b76",
  "ocr_back_key":"a5cf9c8f-2f66-4490-a7db-8a5bc70c1b76"
}

```


O objeto _rg_ é utilizado para representar os RGs em toda a API bem como se foi utilizado algum meio de validação dos mesmos. Eles são representados da seguinte maneira:



* nome: number
  * tipo: string
  * descrição: Número do documento cadastrado, incluindo formatação (Pontos, Hífens, Barras e outros).
* nome: issuer
  * tipo: string
  * descrição: Órgão emissor do documento (Sigla, e.g.: II, SESP...)
* nome: issuer_state
  * tipo: enum
  * descrição: UF emissor do documento.
* nome: issuance_date
  * tipo: date
  * descrição: Data de emissão do documento.
* nome: validation_type
  * tipo: enum
  * descrição: Tipo de validação utilizada durante o cadastro do documento.
* nome: ocr_key
  * tipo: guid
  * descrição: Id retornado pela API de validação de documento da Zaig.


Existem os seguintes enumeradores para _validation\_type_: `zaig_api` e `zaig_sdk`.

Objeto _NaturalPerson_
----------------------

> Exemplo

```
{
  "name": "Melissa Lima Melo",
  "document_number": "677.498.846-61",
  "birthdate": "1960-11-21",
  "email": "exemplo2@sample.com",
  "nationality": "BRA",
  "gender": "female",
  "mother_name": "Raíssa Lima",
  "father_name": "Ronaldo Melo",
  "monthly_income": 800000,
  "declared_assets": 18600000,
  "occupation": "law",
  "address": {
    "country": "BRA",
    "street": "Rua Castro Alves",
    "number": "100",
    "complement": "Ap 202",
    "neighborhood": "Parque Estrela Dalva I",
    "city": "Luziânia",
    "state": "GO",
    "postal_code": "72804-050"
  },
  "phones": [
    {
      "international_dial_code": "55",
      "area_code": "11",
      "number": "21158745",
      "type": "residential"
    }
  ]
}

```


O objeto _NaturalPerson_ representa os dados de uma pessoa que pode ser o próprio tomador, um garantidor ou um sócio de uma empresa tomadora. Ele é composto por:


|nome           |tipo         |descrição                                                 |
|---------------|-------------|----------------------------------------------------------|
|name           |string       |Nome completo                                             |
|document_number|string       |O CPF, formatado adequadamente                            |
|birthdate      |date         |A data de nascimento da pessoa                            |
|email          |string       |O email da pessoa                                         |
|gender         |enum         |O gênero da pessoa, de acordo com a lista de enumeradores.|
|address        |Address      |O endereço residencial da pessoa                          |
|phones         |list of Phone|Os telefones colhidos da pessoa                           |


Enumeradores de gênero:

*   `male`
*   `female`
*   `undefined`

Objeto _LegalPerson_
--------------------

> Exemplo

```
{
  "legal_name": "Zaig Tecnologia LTDA",
  "trading_name": "Zaig",
  "document_number": "35.472.523/0001-15",
  "constitution_date": "1990-01-01",
  "constitution_type": "llc",
  "email": "exemplo@sample.com",
  "address": { ... },
  "phones": [ { ... } ],
  "shareholders": [ { ... }]
}

```


O objeto _LegalPerson_ representa os dados de uma empresa que está tomando crédito ou garantindo o crédito (Fiador). Ele é composto por:



* nome: legal_name
  * tipo: string
  * descrição: Razão social
* nome: trading_name
  * tipo: string
  * descrição: Nome fantasia
* nome: document_number
  * tipo: string
  * descrição: O CNPJ, formatado conforme padrão estabelecido nesta documentação
* nome: constitution_date
  * tipo: data
  * descrição: A data de constituição da companhia, conforme junta comercial
* nome: constitution_type
  * tipo: enumerador
  * descrição: O tipo de constituição da empresa: LLC, corp
* nome: email
  * tipo: string
  * descrição: O email do representante da empresa
* nome: address
  * tipo: Address
  * descrição: O endereço da matriz da companhia
* nome: phones
  * tipo: list of Phone
  * descrição: Os telefones colhidos da companhia
* nome: shareholders
  * tipo: list of NaturalPerson
  * descrição: Os sócios da companhia, no modelo de pessoa física (Objeto NaturalPerson)


Objeto _Source_
---------------

> Para pedidos de crédito realizados por meio do site próprio, utilizar o seguinte objeto:

```
{
  "channel": "website",
  "ip": "201.81.161.86",
  "session_id": "b8da64db-e8f8-47fc-8d8e-11ce26da499f"
}

```


> Para pedidos de crédito realizados por meio de aplicativo próprio, utilizar o seguinte objeto:

```
{
  "channel": "app",
  "platform": "android",
  "ip": "201.81.161.86",
  "session_id": "b8da64db-e8f8-47fc-8d8e-11ce26da499f"
}

```


O objeto source representa o local onde o pedido de crédito foi realizado.

Objeto _Warrant_
----------------

> Para análises de crédito que possuam algum tipo de garantia, o objeto warrant pode ser utilizado para informá-lo à nossa API. No momento, somente garantias de imóvel são aceitas e caso seja necessário outro tipo de garantia, basta entrar em contato com o nosso [suporte](mailto:suporte.caas@qitech.com.br)

```
  {
    "warrant_type": "real_estate",
    "address": { ... },
    "property_type": "house",
    "estimated_value": 100000000,
    "forced_selling_value": 60000000
  }

```


Para a garantia do tipo **real\_estate**, o objeto é formado pelos seguintes campos:



* nome: warrant_type
  * tipo: enum
  * descrição: Define o tipo de garantia. No momento somente real_estate está implementado.
* nome: address
  * tipo: Address
  * descrição: Objeto do tipo Address que identifica o imóvel dado como garantia
* nome: property_type
  * tipo: enum
  * descrição: O tipo de imóvel em questão, no momento estão disponíveis: house, commercial_building, office, appartment
* nome: estimated_value
  * tipo: integer
  * descrição: O valor estimado do imóvel
* nome: forced_selling_value
  * tipo: integer
  * descrição: O valor de venda forçada estimado do imóvel


Objeto _ScrParameters_
----------------------

```
  {
    "scr_parameters": {
      "signers": [
        {
          "document_number": "111.222.333-44",
          "name": "Felipe Marques da Silva",
          "email": "felipe.silva@qitech.com.br",
          "phone": {
            "number": "991722315",
            "area_code": "16",
            "international_dial_code": "55"
          }
        }
      ],
      "signature_evidence": {
        "ip_address": "179.104.42.245",
        "session_id": "ddb1d063-4fdf-4330-af9c-3316e9142ff3",
        "access_token":         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36PO6yJV_adQssw5d",
        "additional_data": {
          ...
        },
        "signed_term": {
          "raw_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum erat et tempus dapibus. Donec eu sapien tortor. Pellentesque 
            et tortor eget erat pulvinar mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ornare diam arcu, sit amet auctor lorem varius quis. Ut pretium venenatis magna sed ultrices. Donec quis tortor odi."
        }
      }
    }
  }

```




* nome: signers
  * tipo: Lista de Signer
  * descrição: Lista de pessoas que vão assinar ou assinaram a autorização de consentimento para consulta SCR. Este objeto só deve ser enviado no caso de análises de crédito de pessoas jurídicas.
* nome: signature_evidence
  * tipo: SignatureEvidence
  * descrição: Objeto que para envio das informações coletadas no momento da autorização de consentimento quando a autorização é solicitada na plataforma do cliente.


Objeto _Signer_
---------------

```
  {
    "document_number": "111.222.333-44",
    "name": "Felipe Marques da Silva",
    "email": "felipe.silva@qitech.com.br",
    "phone": {
      "number": "991722315",
      "area_code": "16",
      "international_dial_code": "55"
    }
  }

```



|nome           |tipo  |descrição                        |
|---------------|------|---------------------------------|
|document_number|string|Número do documento do assinante.|
|name           |string|Nome do assinante.               |
|email          |string|Email do assinante.              |
|phone          |Phone |Telefone do assinante.           |


Objeto _Signature\_Evidence_
----------------------------

```
  {
    "signature_evidence": {
      "ip_address": "179.104.42.245",
      "session_id": "ddb1d063-4fdf-4330-af9c-3316e9142ff3",
      "access_token":         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36PO6yJV_adQssw5d",
      "additional_data": {
        ...
      },
      "signed_term": {
        "raw_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum erat et tempus dapibus. Donec eu sapien tortor. Pellentesque 
          et tortor eget erat pulvinar mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ornare diam arcu, sit amet auctor lorem varius quis. Ut pretium venenatis magna sed ultrices. Donec quis tortor odi."
      }
    }
  }

```




* nome: ip_address
  * tipo: string
  * descrição: IP do assinante
* nome: session_id
  * tipo: string
  * descrição: Identificador de sessão do usuário na sua plataforma, deve ser algum identificador que permita solicitar auditoria de um OptIn feito na sua plataforma através deste identificador.
* nome: access_token
  * tipo: string
  * descrição: Identificador do usuário logado na sua plataforma, deve ser possível solicitar auditoria de cadastro deste usuário através deste identificador.
* nome: additional_data
  * tipo: objeto
  * descrição: Objeto JSON configurável para acomodar informações adicionais que o parceiro julgar relevantes que adicionem fidelidade/credibilidade/autent icidade na assinatura realizada dentro de sua plataforma.
* nome: signed_term
  * tipo: SignedTerm
  * descrição: Objeto que traz informações sobre o termo que está sendo utilizado para coleta de consentimento.


Objeto _SignedTerm_
-------------------

```
  {
    "raw_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum erat et tempus dapibus. Donec eu sapien tortor. Pellentesque et tortor eget erat pulvinar mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin ornare diam arcu, sit amet auctor lorem varius quis. Ut pretium venenatis magna sed ultrices. Donec quis tortor odi."
  }

```



|nome    |tipo  |descrição                                    |
|--------|------|---------------------------------------------|
|raw_text|string|Texto plano do termo que está sendo assinado.|


Atualizações no status (Para cadastros que sejam derivados para análise manual ou que sejam respondidos como Pendente), são notificados por meio de Webhook. Para tanto, é necessário, por meio da equipe do [suporte](mailto:suporte-caas@qitech.com.br), configurar um endereço do endpoint por onde vamos notificar as atualizações e também um _signature\_key_ que será utilizado para assinar a requisição.

O cliente pode, apesar de não recomendável, também utilizar a técnica de [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)). Neste caso, basta não configurar o endpoint de webhook e utilizar os endpoints de recuperação de cadastro para proceder com o polling.

Assinatura
----------

Para garantir que a requisição recebida no endpoint do webhook parte dos nossos servidores, deve ser realizado o cálculo do hash HMAC da requisição, considerando os parâmetros definidos abaixo, e então, comparar este hash calculado com o enviado no header de assinatura (http header _signature_) da requisição. Caso as assinaturas sejam compatíveis, isso significa que a requisição partiu dos nossos servidores e que é confiável.

### Cálculo do Hash HMAC

Para o cálculo do hash HMAC os seguintes parâmetros devem ser considerados:



* Parâmetro: Método
  * Valor: SHA1
* Parâmetro: Chave
  * Valor: signature_key acordado com equipe de suporte
* Parâmetro: Mensagem
  * Valor: Concatenação das seguintes strings, nessa ordem:  URL de webhook, Método de Webhook (string "PUT"), body recebido da requisição de webhook


> Exemplo de cálculo de assinatura em Python

```
    import hmac
    import hashlib

    SIGNATURE_KEY='SIGNATURE_KEY'
    WEBHOOK_URL='https://webhook_url.com'
    WEBHOOK_METHOD='PUT'

    PAYLOAD_EXAMPLE='{\"natural_person_id\": \"teste_webhook_1\", \"analysis_status\": \"automatically_reproved\", \"event_date\": \"2023-06-14T14:38:36Z\"}'

    def validate_hmac(payload):
            hmac_calculated = (hmac
                                    .new(SIGNATURE_KEY.encode('utf-8'), (WEBHOOK_URL + WEBHOOK_METHOD + payload).encode('utf-8'), hashlib.sha1)
                                    .hexdigest())
            return hmac_calculated

```


Requisição
----------

> Exemplo de requisição

```
    {
        "credit_proposal_natural_person_id": "123456",
        "analysis_status": "manually_approved",
        "event_date": "2019-10-01T10:37:25-03:00"
    }

```


A requisição possui o formato ao lado e notifica a mudança no status. É importante ressaltar que a requisição utiliza o verbo HTTP PUT e o corpo da requisição é enviado como texto codificado em UTF-8.

Retentativas
------------

A notificação é considerada realizada quando recebe como resposta um HTTP Status 200. Caso as notificações falhem, serão feitas 5 retentativas, com os seguintes intervalos, até que um 200 seja retornado ou as tentativas terminem:

*   30 segundos
*   60 segundos
*   120 segundos
*   240 segundos
*   360 segundos

Para facilitar a integração e garantir a integridade da informação, foram definidos alguns padrões que são seguidos em toda a API.

Valores Monetários
------------------

> Exemplos:

```
10000
12345
98741
1223
1
0

```


As APIs assumem que todos os valores monetários enviados são em Reais Brasileiros. Os valores devem ser enviados como inteiro em centavos.

> Alguns exemplos:

```
2019-10-15T22:35:12-03:00
2018-05-01T13:32:11+00:00
2019-05-01T00:00:00+00:00

```


É representada conforme a ISO 8601. Neste caso, o fuso-horário é colocado logo após o horário e deve representar o fuso do local onde aquele dado será valido. Por exemplo, se um aluguel estiver marcado para começar às 09:30 no aeroporto de Brasília, o horário enviado deverá ser representado por 09:30-03:00, se o aluguel estiver marcado para começar às 09:30 em Manaus, deverá ser representado por 09:30-04:00.

A máscara utilizada para validação é a seguinte:

`YYYY-MM-ddThh:mm:ss±hh:mm`

Data e Hora sem Fuso Horario
----------------------------

> Alguns exemplos:

```
2019-10-15T22:35:12
2018-05-01T13:32:11
2019-05-01T00:00:00

```


É representada conforme a ISO 8601. Dados que independem de fuso-horário deverão ser enviados sem ele, sempre em UTC, com a letra Z indicando que este dado está em UTC. O seguinte formato, portanto, será validado:

`YYYY-MM-ddThh:mm:ssZ`

Data
----

> Alguns exemplos

```
2019-10-15
2019-01-01
2017-03-20

```


No caso de campos que recebem somente data, uma data de nascimento, por exemplo, somente a data, sem nenhum horário deve ser enviada com o seguinte formato:

`YYYY-MM-dd`

Documentos
----------

Uma vez que os números de documento são bastante variados e muitos deles possuem caracteres que não se enquadram como numéricos, definem-se todos os números de documento como string. Outro bom motivo para definí-los como string é evitar que os zeros à esquerda desapareçam. Documentos previstos nesta página possuem uma máscara bem definida e estarão sujeitos a validação. O restante dos documentos, como RG, dada sua falta de padronização, não serão validados.

CPF
---

> Exemplos de CPFs válidos contra a máscara definida:

```
123.456.789-12
321.987.543-23
111.283.333-00

```


> Exemplos de CPFs inválidos contra a máscara definida:

```
8.577.477-8
08.104.627/0001-23
123.456.789-1
23.456.789-01

```


O CPF é sempre definido como uma string e será validado conta a máscara:

`###.###.###-##`

CNPJ
----

> Exemplos de CNPJs válidos contra a máscara definida:

```
08.104.627/0001-02
01.079.210/0114-67
32.402.502/0001-35

```


> Exemplos de CNPJs inválidos contra a máscara definida:

```
8.577.477-8
123.456.789-12
321.987.543-23
32.402.502/0001-3
032.402.502/0001-3

```


O CNPJ é sempre definido como uma string e será validado conta a máscara:

`##.###.###/####-##`

IP
--

> Exemplos de IPs válidos contra a máscara definida:

```
201.81.161.86
201.081.161.86
201.81.161.086
201.81.0.1

```


> Exemplos de IPs inválidos:

```
201.81..86
358.81.161.86
201.81.161

```


IPs deverão ser enviados sempre em IPv4, zeros à esquerda poderão ou não ser enviados, respeitando a seguinte máscara:

`###.###.###.###`

Todas as APIs da Zaig utilizam a seguinte padronização nos status HTTP de retorno, de acordo com o [RFC 7231](https://tools.ietf.org/html/rfc7231):



* Status HTTP: 400
  * Significado: Bad Request
  * Descrição: A requisição enviada possui algum erro de formatação. Na maioria dos casos, retornamos no corpo da mensagem uma explicação de onde está o erro.
* Status HTTP: 401
  * Significado: Unauthorized
  * Descrição: Houve algum problema na autenticação, verifique se a API Key está correta e no header correto, de acordo com a seção Autenticação.
* Status HTTP: 403
  * Significado: Forbidden
  * Descrição: O endpoint acessado é de uso interno e não está disponível para esta API Key.
* Status HTTP: 404
  * Significado: Not Found
  * Descrição: O dado requisitado não foi encontrado usando a chave utilizada. Este status também é retornado quando um endpoint inválido é requisitado.
* Status HTTP: 405
  * Significado: Method Not Allowed
  * Descrição: O método HTTP utilizado não se aplica ao endpoint utilizado.
* Status HTTP: 406
  * Significado: Not Acceptable
  * Descrição: Os dados enviados no corpo da requisição são inválidos. Em geral, isso significa que os dados enviados não são um JSON válido.
* Status HTTP: 409
  * Significado: Conflict
  * Descrição: O id da requisição corresponde a um id já processado anteriormente. Este status é retornado no caso de requisições duplicadas enviadas ao servidor.
* Status HTTP: 500
  * Significado: Internal Server Error
  * Descrição: Tivemos um problema para processar esta requisição, ao encontrarmos esse erro nossos especialistas são automaticamente notificados e iniciam a análise e solução imediatamente.
* Status HTTP: 503
  * Significado: Service Unavailable
  * Descrição: Você se deparou com uma indisponibilidade, planejada ou não, de infraestrutura dos nossos servidores.
