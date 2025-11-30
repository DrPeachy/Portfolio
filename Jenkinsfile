pipeline {
    agent any

    environment {
        // Defines the credentials ID stored in Jenkins
        SSH_CRED_ID = 'namecheap-ssh-key' 
        // Namecheap server details
        REMOTE_USER = 'charkukk'
        REMOTE_HOST = 'charlesrealm.com'
        REMOTE_PORT = '21098'
        REMOTE_DIR = '/home/charkukk/public_html/'
        SUB_FOLDER = 'react-portfolio'

        // Temperary allow error
        CI = 'false'
    }

    stages {
        stage('Build') {
            steps {
                dir(env.SUB_FOLDER) {
                    // Install dependencies and build the React app
                    powershell 'npm install --legacy-peer-deps'
                    powershell 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                // 【核心修改】
                // 不再使用 sshagent {} 插件
                // 改用 withCredentials，它会把私钥临时存为一个文件，路径保存在 SSH_KEY_FILE 变量里
                withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CRED_ID, keyFileVariable: 'SSH_KEY_FILE')]) {
                    // Windows PowerShell 脚本
                    // 注意：$env:SSH_KEY_FILE 是读取 Jenkins 生成的临时密钥文件路径
                    powershell """
                        Write-Host "Deploying to ${REMOTE_HOST}..."
                        
                        scp -P ${REMOTE_PORT} -i $env:SSH_KEY_FILE -o StrictHostKeyChecking=no -r ./${SUB_FOLDER}/build/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}
                        
                        Write-Host "Deployment Complete!"
                    """
                }
            }
        }
    }
}