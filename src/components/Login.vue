<template>
  <main>
    <v-container fluid fill-height class="posisinya gradienMerah2">
      <v-layout flex align-center justify-center>
        <v-card
          style="
            padding: 30px 40px 10px 0px;
            border-radius: 20px;
            border: transparent;
          "
          elevation="24"
        >
          <div class="centered">
            <div class="flexbox">
              <div class="left-half">
                <img
                  src="../assets/logo ajr.png"
                  alt="logo"
                  height="200px"
                  class="center"
                />
              </div>
              <v-divider class="mx-2" vertical></v-divider>
              <div class="right-half">
                <h2
                  style="
                    font-family: 'Playfair Display', serif;
                    font-weight: 600;
                  "
                >
                  Login Page
                </h2>
                <br />
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
                    required
                    outlined
                  >
                  </v-text-field>
                  <v-layout justify-end>
                    <v-btn
                      class="mr-2"
                      @click="submit"
                      :class="{
                        'blue darken-1 white--text': valid,
                        disabled: !valid,
                      }"
                      >Login
                    </v-btn>
                  </v-layout>
                </v-form>
              </div>
            </div>
          </div>
        </v-card>
      </v-layout>
      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{ error_message }}
      </v-snackbar>
    </v-container>
  </main>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      valid: false,
      password: "",
      posisi: "",
      passwordRules: [(v) => !!v || "Password tidak boleh kosong"],
      email: "",
      emailRules: [(v) => !!v || "E-mail tidak boleh kosong"],
    };
  },
  methods: {
    submit(){
      let url = this.$api + "/login";
      this.$http.post(url, {
        email: this.email,
        password: this.password,
      }).then((response)=> {

        if(response.data.data.id_customer != null)
        {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("id_customer", response.data.data.id_customer);
          localStorage.setItem("email", response.data.data.email_customer);
        }
        else if(response.data.data.id_pegawai != null)
        {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("id_pegawai", response.data.data.id_pegawai);
          localStorage.setItem("email", response.data.data.email);
          localStorage.setItem("id_role", response.data.data.id_role);
        }
        else if(response.data.data.id_driver != null)
        {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("id_driver", response.data.data.id_driver);
          localStorage.setItem("email", response.data.data.email_driver);
        }
        else
        {
          return false;
        }

        this.$router.push("/dashboard");
        this.error_message = response.data.message;
        this.color = "blue";
        this.snackbar = true;
        this.clear();
        this.load = false;
      })
      .catch((error) => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        localStorage.removeItem("token");
        this.load = false;
      })
    }, 
  },
};
</script> 

<style scoped>
.posisinya {
  position: absolute;
  left: 0px;
  right: 0px;
  font-family: "Montserrat", sans-serif;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
}
</style>

<style scoped>
.centered {
  display: grid;
  place-items: center;

  resize: both;
  overflow: auto;
}

.flexbox {
  display: flex;
  flex-direction: row;
  font-family: "Montserrat", sans-serif;
  width: 50vw;
}
.left-half {
  flex: 30%;
  padding: 1rem;
}

.right-half {
  flex: 70%;
  padding: 1rem;
}
</style>