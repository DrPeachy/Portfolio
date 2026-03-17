pipeline {
    agent any

    environment {
        // Defines the credentials ID stored in Jenkins
        SSH_CRED_ID = 'namecheap-ssh-key' 
        // Namecheap server details
        REMOTE_USER = 'charkukk'
        REMOTE_HOST = '162.213.253.52'
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
                    bat """
                        @echo off
                        echo Deploying to %REMOTE_HOST%...

                        echo Fixing local SSH key permissions...
                        icacls "%SSH_KEY_FILE%" /inheritance:r
                        icacls "%SSH_KEY_FILE%" /grant "%USERNAME%:R"
                        
                        REM 1. 进入构建目录
                        cd %SUB_FOLDER%\\build
                        
                        REM 2. 上传文件 (scp)
                        scp -o BatchMode=yes -o StrictHostKeyChecking=no -P %REMOTE_PORT% -i "%SSH_KEY_FILE%" -r . %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_DIR%/
                        
                        echo Upload Complete. Fixing permissions...
                        
                        REM 3. 【新增】远程执行修复权限命令 (ssh)
                        REM 这条命令会登录服务器，把文件夹设为 755，把文件设为 644
                        REM 注意：一条长命令搞定所有，不用担心新文件了
                        
                        ssh -o BatchMode=yes -o StrictHostKeyChecking=no -p %REMOTE_PORT% -i "%SSH_KEY_FILE%" %REMOTE_USER%@%REMOTE_HOST% "find ~/public_html -type d -exec chmod 755 {} \\; && find ~/public_html -type f -exec chmod 644 {} \\;"
                        
                        echo Deployment and Permissions Fix Complete!
                    """
                }
            }
        }
    }
}