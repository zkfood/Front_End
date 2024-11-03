const ambiente = {
    local: "http://localhost:8080/",
    producao: "não tem"
};

const prefix = {
    usuarios: "usuarios",
    pedidos: "pedidos",
    produtos: "produtos",
    avaliacoes: "avaliacoes",
    enderecos: "enderecos",
};

class FetchBuilder {
    async request(url, request = {}) {
        // padrão se nn tiver request

        const {
            body,
            newQueryStringParams = null,
            newHeaders = {},
            method = 'GET'
        } = request;

        const headers = new Headers({
            ...newHeaders
        })
        // define como json
        if (newHeaders.contentType !== undefined) {
            headers.append('Content-Type', 'application/json');
        }


        //faz a query
        const queryStringParams = newQueryStringParams
            ? '?' + new URLSearchParams(newQueryStringParams).toString()
            : '';

        try {
            const response = await fetch(url + queryStringParams, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }

            return await response.json(); 
        } catch (error) {
            //TODO: fazer o popup
            
            console.error("Erro na requisição:", error);
            throw error; // Propaga o erro
        }
    }
}

class Request {
    constructor({ body, newQueryStringParams = null, newHeaders, method = 'GET' } = {}) {
        this.body = body;
        this.newQueryStringParams = newQueryStringParams;
        this.newHeaders = newHeaders;
        this.method = method;
    }
}
