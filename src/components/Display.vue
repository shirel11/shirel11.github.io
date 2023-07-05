<template>
  <div v-if="isFinish" class="container">
    <header class="jumbotron">
      <h3 style="text-align: center;">{{ content }}</h3>
    </header>
  </div>
<div v-if="userNotExsist && !isFinish">
    <div class="col-lg-12 control-section form-support">
      <div class="control_wrapper" id="control_wrapper">
        <form id="form1" >
          <h3 class="form-title">פרטי משתמש</h3>
          <div class="form-group form-style" style="padding-top: 11px" >
            <div class="e-float-input">
                  <ejs-textbox v-model="generalUser.Name" floatLabelType="Auto" placeholder="שם מלא"></ejs-textbox>
                  <ejs-textbox v-model="generalUser.Email" floatLabelType="Auto" placeholder="דוא׳׳ל"></ejs-textbox>
            </div>
          </div>         
        </form>
        <div class="submitBtn">
          <button class="btn btn-primary btn-block" @click="handleSubmitGeneralUser"  id="submit-btn">שלח</button>
          <a  href="#" @click="()=>{ this.$router.push({name:'login'});}" >לחץ להתחבור</a>
        </div>
      </div>
    </div>
  </div>


 <div  v-if="!userNotExsist && !isFinish">
    <div class="col-lg-12 control-section form-support">
      <div class="control_wrapper" id="control_wrapper">
        <form id="form1" >
          <h3 class="form-title">{{vote.name}}</h3>
          <div v-html="vote.details" style="text-align: right;">
      
          </div>
          <div class="form-group form-style" style="padding-top: 11px" v-for="(question, index) in vote.voteQuestions" :key="index">
            <div class="e-float-input">
             <h5 style="direction: rtl;text-align: right;">{{question.text}} </h5>  
             <p v-if="question.maxSelection > 1" style="text-align: right;">ניתן לבחור עד {{question.maxSelection}} תשובות</p>        
            </div>
            <div class="e-float-input" v-for="(answer, jndex) in question.questionAnswers" :key="jndex">
                <div class="e-input-group e-float-icon-left">
                  <ejs-checkbox v-if="answer.type==='checkbox'" @change="onCheckBoxChange(index,jndex)" :disabled="answer.disableCheckBox" v-model="answer.value" :label="answer.text" :checked="answer.selectedRadio" :name="`question[${answer.id}]`" :id="`question[${answer.id}]`"></ejs-checkbox>
                  <ejs-textbox v-if="answer.type==='text'" v-model="answer.value" floatLabelType="Auto" :name="`question[${answer.id}]`" :id="`question[${answer.id}]`" :placeholder="answer.text"></ejs-textbox>
                  <ejs-numerictextbox v-if="answer.type==='number'" v-model="answer.value" floatLabelType="Auto" :name="`question[${jndex}]`" :id="`question[${jndex}]`" :placeholder="answer.text"></ejs-numerictextbox>
                  <ejs-radiobutton v-if="answer.type==='radio'" @change="onRadioChange(index,jndex)" :checked="answer.value" :label="answer.text" :name="`question[${answer.id}]`" :id="`question[${answer.id}]`"  :value="answer.text" ></ejs-radiobutton>
                </div>              
            </div>
          </div>          
        </form>
        <div class="submitBtn">
          <button class="submit-btn e-btn" @click="handleSubmit"  id="submit-btn">שלח</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import voteService from '../services/vote.service';
 import { CheckBoxComponent,RadioButtonComponent} from "@syncfusion/ej2-vue-buttons";
 import { TextBoxComponent,NumericTextBoxComponent  } from "@syncfusion/ej2-vue-inputs";

export default {
  name: "Display",
  data() {
    return {
      generalUser:{
        Name:'',
        Email:'',
      },
      isFinish:false,
      userNotExsist:true,
      voteAnswers:[],
      vote:{
        id:0,
        name: "",
        type: 0,
        user: null,
        userID: 1,
        voteQuestions: []
      },
      content: "",
    };
  },
  methods:{
    onCheckBoxChange(idx,jdx){
      if(this.vote.voteQuestions[idx].questionAnswers[jdx].value===false){
       this.vote.voteQuestions[idx].questionAnswers[jdx].value=false;
       this.vote.voteQuestions[idx].checkboxSelectionCount=this.vote.voteQuestions[idx].questionAnswers.filter(i=>i.value===true).length;
      }
      else{
      this.vote.voteQuestions[idx].questionAnswers[jdx].value=true;
      this.vote.voteQuestions[idx].checkboxSelectionCount=this.vote.voteQuestions[idx].questionAnswers.filter(i=>i.value===true).length;

      }
      
        for (let index = 0; index < this.vote.voteQuestions[idx].questionAnswers.length; index++) {
          const element = this.vote.voteQuestions[idx].questionAnswers[index];
          if(this.vote.voteQuestions[idx].checkboxSelectionCount>=this.vote.voteQuestions[idx].maxSelection){
              if(element.value)
                this.vote.voteQuestions[idx].questionAnswers[index].disableCheckBox=false;
              else
              this.vote.voteQuestions[idx].questionAnswers[index].disableCheckBox=true;
             }
          else
            this.vote.voteQuestions[idx].questionAnswers[index].disableCheckBox=false;

        }
   
    },
    onRadioChange(index,jndex){
      for (let idx = 0; idx < this.vote.voteQuestions[index].questionAnswers.length; idx++) {
        const element = this.vote.voteQuestions[index].questionAnswers[idx];
        element.value=false;
      }
      this.vote.voteQuestions[index].questionAnswers[jndex].value=true;
      this.vote.voteQuestions[index].selectedAnswer=this.vote.voteQuestions[index].questionAnswers[jndex];
    },
    handleSubmit(){

      for (let idx = 0; idx < this.vote.voteQuestions.length; idx++) {
        for (let jdx = 0; jdx < this.vote.voteQuestions[idx].questionAnswers.length; jdx++) {
          const el= this.vote.voteQuestions[idx].questionAnswers[jdx];
          if(Object.prototype.hasOwnProperty.call(el, "value") && el.value)
            {
                this.voteAnswers.push({                          
                                  questionID:this.vote.voteQuestions[idx].id,
                                  questionAnswerID: el.id,
                                  value: el.value.toString() 
                                  });
            }
        }
        
      }
      const submitObj={
         voteID:this.vote.id,   
        userID:this.generalUser.id??0,
        email:this.generalUser.Email,
        answers:this.voteAnswers
      };
       console.log("submit",submitObj);
      voteService.createVoteAnswers(submitObj).then((res)=>{
        console.log(res);
      }).catch((res)=>{console.log(res);})
      this.isFinish=true;
      this.content="תודה! ";
       this.$root.successToast("נשלח בהצלחה");
    },
    handleSubmitGeneralUser(){
      this.GetVoteByGuid(this.generalUser.Email);
      
    },
    GetVoteByGuid(userGuid){
       voteService.getVoteByGuid(this.$route.params.guid,userGuid).then((res)=>{
      if(res && !res.data.errorCode)
      {
        this.vote = res.data;
        console.log("getVoteByGuid res:",res.data);
         this.userNotExsist=false;
         this.isFinish=false;
     
      }
      if(res.data.errorCode===711 || res.data.errorCode===710){
              this.$router.push({ path: '/NotFound', query: { message: res.data.errorMsg } });

      }
      else if(res.data.errorCode){
              this.$router.push({ path: '/NotFound', query: { message: 'שאלון לא קיים' } });

      }
    }).catch((res)=>{
      console.log(res);
      this.$router.push({ path: '/NotFound', query: { message: 'שאלון לא קיים' } });

    });
    }
  },

  mounted() {
    if(this.$store.state.auth.user){
      this.generalUser.id=this.$store.state.auth.user.userId;
   this.GetVoteByGuid(this.$store.state.auth.user.userId);

    }
    else{
       this.$root.HideOrShowNavBar(false);
    }
  },
   components: {
      "ejs-checkbox": CheckBoxComponent,
      'ejs-textbox' : TextBoxComponent,
      'ejs-numerictextbox' : NumericTextBoxComponent,
        'ejs-radiobutton':RadioButtonComponent,
    },
};
</script>
<style>


@import "../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
#container {
  visibility: hidden;
  padding-left: 5%;
  width: 100%;
}
#loader {
  color: #008cff;
  font-family: "Helvetica Neue", "calibiri";
  font-size: 14px;
  height: 40px;
  left: 45%;
  position: absolute;
  top: 45%;
  width: 30%;
}
.form-support .control_wrapper {
  max-width: 400px;
  margin: auto;
}
.form-support .address-field {
  max-height: 50px;
  resize: none;
}
.form-support #control_wrapper {
  max-width: 500px;
  margin: auto;
  border: 0.5px solid #BEBEBE;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.36);
  padding: 1% 4% 2%;
  background: #f9f9f9;
  margin-bottom: 20%;
}

.form-support .e-error {
  padding-top: 3px;
}
.form-support .e-upload {
  width: 100%;
  position: relative;
  margin-top: 15px;
}
.form-support .control_wrapper .e-upload .e-upload-drag-hover {
  margin: 0;
}

.form-support .submit-btn {
  margin-top: 15px;
}
.form-support .submitBtn .desc {
  margin: 2% 20% 0% 18%;
}
@media only screen and (max-width: 500px) {
  .form-support .submitBtn .desc {
    margin: 12px;
  }
  .form-support .upload-area,
  .e-bigger .upload-area {
    width: 60%;
  }
}
.form-support .submitBtn {
  position: relative;
  text-align: center;
}
.form-support .success .successmsg {
  border: 0.5px solid green;
  padding: 10%;
  color: green;
}
.form-support form#form1 {
  position: relative;
  top: 14%;
}
.form-support .e-upload {
  display: none;
}
.form-support input.choose-file {
  width: 60%;
}
.form-support button#browse {
  float: right;
  margin-right: -115px;
  margin-top: -29px;
  position: relative;
}
.fabric .form-support #browse,
.highcontrast .form-support #browse {
  top: -3px;
}
.bootstrap .form-support #browse {
  top: -6px;
}
.form-support .form-title {
  text-align: center;
}
#form1 .e-float-input:not(.e-input-group),
#form1 .e-float-input.e-control-wrapper:not(.e-input-group) {
  display: inherit;
}

input#mobileno::-webkit-inner-spin-button,
input#mobileno::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.e-float-input.upload-area {
  width: 70%;
}

.form-style{

    border: 1px solid rgb(106, 106, 117);
        padding: 5%;

}
.e-float-input .e-float-line, .e-float-input.e-control-wrapper .e-float-line{
    width: 5% !important;
}
  .e-delete-1:before {
        content: '\e84e';
        font-family: e-icons;
        font-size: 14px;
    }
      .e-delete-1:hover {
      color: red !important;
      cursor: pointer;
    }

    .delteQuestionIcon{
        display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: space-between;
    }
</style>