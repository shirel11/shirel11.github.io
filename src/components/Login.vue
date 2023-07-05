<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-group">
          <label for="username" style="text-align: right;">שם משתמש</label>
          <Field name="username" type="text" class="form-control" />
          <ErrorMessage style="text-align: right;" name="username" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password" style="text-align: right;">סיסמה</label>
          <Field name="password" type="password" class="form-control" />
          <ErrorMessage style="text-align: right;" name="password" class="error-feedback" />
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>התחבר</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  
    props:['Msg'],
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("שדה חובה"),
      password: yup.string().required("שדה חובה"),
    });

    return {
      loading: false,
      message: "",
      schema,
      q : this.$route.query.Msg
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    const ToShowMsg= localStorage.getItem('MsgDisplay');
    if(this.q && ToShowMsg )
    {
     this.$root.warningToast(this.q );
      localStorage.removeItem('MsgDisplay');
    }
    if (this.loggedIn) {
      this.$router.push("/Home");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        (res) => {
          if(res.errorCode && res.errorMsg)
            this.message=res.errorMsg;
           this.loading = false;
          this.$router.push("/Home");
        },
        (error) => {
        this.$root.dangerToast(error.response.data.errorMsg);

          this.loading = false;
          this.message = error.response.data.errorMsg.toString();
        }
      );
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
