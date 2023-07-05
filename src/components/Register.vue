<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username" style="text-align: right;">שם משתמש</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email" style="text-align: right;">דוא''ל</label>
            <Field name="email" type="email" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password" style="text-align: right;">סיסמה</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              הרשמה
            </button>
          </div>
        </div>
      </Form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("שדה חובה")
        .min(3, "חייב להיות לפחות 3 תווים!")
        .max(20, "יכול להיות עד 20 תווים!"),
      email: yup
        .string()
        .required("שדה חובה")
        .email("דוא''ל לא חוקי")
        .max(50, "יכול להיות עד 50 תווים!"),
      password: yup
        .string()
        .required("שדה חובה")
        .min(6, "חייב להיות לפחות 6 תווים!")
        .max(40, "חייב להיות עד 40 תווים!"),
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      user.type='1';
      user.confirmPassword=user.password;
      this.$store.dispatch("auth/register", user).then(
        (res) => {
            if(res.errorCode && res.errorMsg)
              this.message=res.errorMsg;
          this.successful = true;
          this.loading = false;
           this.$root.successToast(`נרשמת בהצלחה `,"בדוק את תיבת הדוא''ל לאישור הרשמה'");

          this.$router.push("/");
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data) ||
            error ||
            error.toString();
          this.successful = false;
          this.loading = false;
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
