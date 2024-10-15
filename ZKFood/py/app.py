from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Variáveis Globais
ACCESS_TOKEN = "1000.6078cbe03baba0ed4ef6fa3390f4ff75.e3073ec67940edc4e9e40f48dd48c6e9"  # Use o token gerado inicialmente
REFRESH_TOKEN = "1000.9d753ffd724b33c69db8fd62231cc069.3dd98ed66846c6cba7545f8f8912189e"  # O refresh token obtido durante o processo de autenticação
CLIENT_ID = "1000.66HX6CLMA17SE12LRJ5ICNZNBW35VY"
CLIENT_SECRET = "7e3ee11ba36476428cb8a0725d36c4ea71572700b5"

# Função para atualizar o Access Token usando o Refresh Token
def refresh_access_token():
    global ACCESS_TOKEN
    url = "https://accounts.zoho.com/oauth/v2/token"
    payload = {
        "refresh_token": REFRESH_TOKEN,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "refresh_token"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    response = requests.post(url, data=payload, headers=headers)
    
    if response.status_code == 200:
        new_token_data = response.json()
        ACCESS_TOKEN = new_token_data['access_token']
        print("Access Token atualizado com sucesso:", ACCESS_TOKEN)
        return ACCESS_TOKEN
    else:
        print("Erro ao atualizar Access Token:", response.status_code, response.text)
        return None

# Função para enviar dados ao Zoho CRM
def enviar_dados_para_zoho(nome, sobrenome, email, telefone):
    url = "https://www.zohoapis.com/crm/v2/Contacts"
    headers = {
        "Authorization": f"Zoho-oauthtoken {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "data": [
            {
                "First_Name": nome,
                "Last_Name": sobrenome,
                "Email": email,
                "Phone": telefone
            }
        ]
    }

    response = requests.post(url, json=payload, headers=headers)
    
    # Verifica se o Access Token expirou
    if response.status_code == 401:  # Unauthorized, token expirado
        print("Access Token expirado, atualizando...")
        if refresh_access_token():  # Atualiza o token
            headers["Authorization"] = f"Zoho-oauthtoken {ACCESS_TOKEN}"  # Atualiza o header com o novo token
            response = requests.post(url, json=payload, headers=headers)  # Tenta novamente
        else:
            return {"message": "Erro ao atualizar o Access Token"}, 401
    
    return response

@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    data = request.json
    nome = data.get('nome')
    sobrenome = "Sobrenome"  # Exemplo de sobrenome, você pode coletar isso no formulário
    email = data.get('email')
    telefone = data.get('telefone')

    print(f"Dados Recebidos: {data}")
    
    # Enviar os dados ao Zoho CRM
    response = enviar_dados_para_zoho(nome, sobrenome, email, telefone)
    
    if response.status_code == 201:
        return jsonify({"message": "Cadastro realizado com sucesso!"}), 201
    else:
        return jsonify({"message": "Erro ao realizar cadastro.", "details": response.json()}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
