<template>
  <div class="personal-info-content">
    <h2 class="page-title">
      <i class="el-icon-user"></i> 个人信息
    </h2>

    <div class="info-content" v-loading="loading">
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="100px"
        class="user-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="头像">
          <div class="avatar-upload">
            <img :src="userForm.avatar" class="avatar" />
            <p class="avatar-tip">头像功能演示中</p>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateUserInfo } from '@/api/user'

export default {
  name: 'PersonalInfo',
  data() {
    return {
      userForm: {
        username: '',
        nickname: '',
        phone: '',
        email: '',
        avatar: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      if (this.userInfo) {
        this.userForm = {
          username: this.userInfo.username || '',
          nickname: this.userInfo.nickname || '',
          phone: this.userInfo.phone || '',
          email: this.userInfo.email || '',
          avatar: this.userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        }
      }
    },
    
    handleSubmit() {
      this.$refs.userForm.validate(async (valid) => {
        if (!valid) return
        
        this.loading = true
        try {
          await updateUserInfo(this.userForm)
          
          // 更新store中的用户信息
          this.$store.dispatch('user/updateUserInfo', {
            ...this.userInfo,
            ...this.userForm
          })
          
          this.$message.success('保存成功')
        } catch (error) {
          console.error('保存失败:', error)
          this.$message.error('保存失败')
        } finally {
          this.loading = false
        }
      })
    },
    
    handleReset() {
      this.loadUserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-info-content {
  .page-title {
    font-size: 20px;
    color: #333;
    margin: 0 0 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e4e7ed;

    i {
      color: #e4393c;
      margin-right: 10px;
    }
  }

  .user-form {
    max-width: 500px;

    .avatar-upload {
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid #e4e7ed;
        object-fit: cover;
      }

      .avatar-tip {
        margin-top: 10px;
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
