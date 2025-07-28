from flask import Flask, request, render_template, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
from config import Config


import os

app = Flask(__name__)

# Carregar as configurações do arquivo config.py
app.config.from_object(Config)

mysql = MySQL(app)


app.secret_key = 's3gR3tK3y!@#12345'


# Configuração para salvar arquivos
UPLOAD_FOLDER = 'static/uploads'  # Pasta onde as imagens serão salvas
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Criar a pasta de uploads se não existir
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    # Registra o IP do visitante
    ip_visitante = request.remote_addr
    cursor = mysql.connection.cursor()
    
    # Inseri o IP na tabela de visitas
    cursor.execute("INSERT INTO visitas (ip) VALUES (%s)", (ip_visitante,))
    mysql.connection.commit()
    
    # Conta o número total de visitas
    cursor.execute("SELECT COUNT(*) FROM visitas")
    total_visitas = cursor.fetchone()[0]
    cursor.close()

    # Passar o total de visitas para o template
    return render_template('Principal/main.html', total_visitas=total_visitas)



@app.route('/denunciar')
def denunciar():
    return render_template('Denunciar/denunciar.html')

@app.route('/historico')
def historico():
    return render_template('Historico/historico.html')

@app.route('/sobre')
def sobre():
    return render_template('Sobre/sobre.html')

@app.route('/entrar')
def entrar():
    return render_template('Entrar/entrar.html')




## RECEBE A DENUNCIA

@app.route('/api/denuncia', methods=['POST'])
def receber_denuncia():
    print(request.form)
    tipo_violacao = request.form['tipoViolacao']
    detalhes = request.form['detalhes']
    localizacao = request.form['localizacao']
    anonymo = request.form['anonymo']
    nome = request.form.get('nome')
    rg = request.form.get('rg')
    id_admin = 1  # Aqui sempre vai ser um como exemplo, mas no site real, poderia ser divido por regioes.

    # Inicia o cursor para o banco de dados
    cursor = mysql.connection.cursor()

    # Obter o ID da visita atual
    ip_visitante = request.remote_addr
    cursor.execute("SELECT id FROM visitas WHERE ip = %s ORDER BY data_visita DESC LIMIT 1", (ip_visitante,))
    visita = cursor.fetchone()
    id_visita = visita[0] if visita else None  # Se não houver visita, será None

    if 'fotos[]' in request.files:
        fotos = request.files.getlist('fotos[]')
        caminhos_imagens = []  # Lista para armazenar os caminhos das imagens

        for imagem in fotos:
            if imagem:
                # Gerar um nome de arquivo unico
                imagem_filename = os.path.join(app.config['UPLOAD_FOLDER'], imagem.filename)
                try:
                    imagem.save(imagem_filename)  # Salvar no caminho completo
                    caminhos_imagens.append(imagem_filename)  # Adiciona o caminho à lista
                except Exception as e:
                    return f"Erro ao salvar a imagem: {str(e)}", 500  # Retorna o erro como resposta

        # junta os caminhos em uma única string, separada por virgulas
        caminhos_imagens_str = ','.join(caminhos_imagens).replace('\\', '/')

        # salvar a denuncia no banco de dados com os caminhos das imagens, id_admin e id_visita
        cursor.execute(
            "INSERT INTO denuncia (tipo_violacao, detalhes, localizacao, anonymo, nome, rg, imagem, id_admin, id_visita) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (tipo_violacao, detalhes, localizacao, anonymo, nome, rg, caminhos_imagens_str, id_admin, id_visita))
    else:
        # faz a denuncia mesmo sem imagem
        cursor.execute(
            "INSERT INTO denuncia (tipo_violacao, detalhes, localizacao, anonymo, nome, rg, imagem, id_admin, id_visita) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (tipo_violacao, detalhes, localizacao, anonymo, nome, rg, None, id_admin, id_visita))  # Salvar None se não houver imagem

    mysql.connection.commit()
    cursor.close()

    return 'Denúncia recebida com sucesso!', 201




## COLETA OS DADOS DA DENUNCIA E MANDA PARA O HISTORICO

@app.route('/api/denuncias', methods=['GET'])
def get_denuncias():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id_denuncia, localizacao, tipo_violacao, detalhes, nome, rg, imagem, id_admin, id_visita FROM denuncia")
    result = cursor.fetchall()
    cursor.close()

    # Formata os dados para JSON
    denuncias = [{
        'id_denuncia': loc[0],
        'localizacao': loc[1],
        'tipo_violacao': loc[2],
        'detalhes': loc[3],
        'nome': loc[4] if loc[4] else 'Anônimo',  # Se o nome estiver vazio, exibe 'Anônimo'
        'rg': loc[5] if loc[5] else 'Não colocou RG',
        'imagem': loc[6],
        'id_admin': loc[7],
        'id_visita': loc[8]
    } for loc in result]
    
    return jsonify(denuncias)





#LOGIN DE ADM

@app.route('/api/login_admin', methods=['POST'])
def login_admin():
    username = request.form['username']
    password = request.form['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id_admin, senha FROM administradores WHERE usuario = %s", (username,))
    admin = cursor.fetchone()
    cursor.close()

    if admin and admin[1] == password:
        return redirect(url_for('painel', username=username))  # Passa o username como parametro
    return jsonify({'error': 'Usuário ou senha inválidos'}), 401  # Retorna um JSON com a mensagem de erro




@app.route('/painel')
def painel():
    username = request.args.get('username')  # pega o username da URL
    if not username:
        return redirect(url_for('entrar'))  # Redireciona para a página de login se não houver username
    return render_template('Painel_ADM/painel.html', username=username)



@app.route('/api/deletar_denuncia/<int:id>', methods=['DELETE'])
def deletar_denuncia(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM denuncia WHERE id_denuncia = %s", (id,))
    mysql.connection.commit()
    cursor.close()
    return 'Denúncia deletada com sucesso!', 200









if __name__ == '__main__':
    app.run(debug=True)

