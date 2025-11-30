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
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull code from GitHub
                git branch: 'main', url: 'https://github.com/yourname/portfolio.git'
            }
        }

        stage('Build') {
            steps {
                // Provide Node environment
                nodejs(nodeJSInstallationName: 'Node16') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent (credentials: [SSH_CRED_ID]) {
                    // Windows 下不能用 sh，要用 powershell 或 bat
                    // Windows 下没有 rsync，最简单是用 scp (Secure Copy)
                    // 注意：HostKeyChecking=no 是为了跳过第一次连接的 yes/no 询问
                    
                    // 这里的写法是：把当前目录的所有内容 (*) 拷贝到远程目录
                    // -P (大写) 是 scp 指定端口的参数 (ssh 是小写 -p)
                    // -r 代表递归拷贝 (文件夹)
                    powershell """
                        scp -P ${REMOTE_PORT} -o StrictHostKeyChecking=no -r ./* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}
                    """
                }
            }
        }
    }
}