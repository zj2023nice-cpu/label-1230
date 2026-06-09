<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">欢迎登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        
        this.loading = true
        try {
          const res = await login(this.loginForm)
          if (res.code === 200) {
            this.$store.dispatch('user/login', res.data)
            this.$message.success('登录成功')
            
            // 跳转到原页面或首页
            const redirect = this.$route.query.redirect || '/'
            this.$router.push(redirect)
          }
        } catch (error) {
          console.error('登录失败:', error)
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e4393c 0%, #c81623 50%, #ff6b6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-box {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  .login-title {
    text-align: center;
    font-size: 28px;
    color: #333;
    margin: 0 0 30px;
  }

  .login-form {
    .login-btn {
      width: 100%;
      height: 45px;
      font-size: 16px;
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;

    .register-link {
      color: #e4393c;
      margin-left: 5px;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .demo-info {
    margin-top: 20px;
  }
}
</style>
