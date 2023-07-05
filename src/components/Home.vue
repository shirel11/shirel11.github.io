<template>

  <div>
    <div class="col-lg-12 control-section form-support">
      <div class="control_wrapper" id="control_wrapper">
        <form id="form1" >

          <div class="tab">
              <h4 class="form-title">בניית שאלון</h4>
              <div id="BuildVoteDetials" class="form-group form-style">
               <h6 class="form-title" style="text-align: right;">פרטי שאלון</h6>
                <div class="e-float-input">    
                  <div class="dateContiner">
                    <ejs-datepicker width="60%" :serverTimezoneOffset="{timezone}" locale="en-US" format="dd/MM/yyyy" v-model="vote.StartDate" :min="new Date()" :value="vote.StartDate" floatLabelType="Auto" class="e-input" placeholder="תאריך התחלה"></ejs-datepicker>
                    <ejs-timepicker step="5" :min="minTime" :max="maxTime" locale="he" :format="timeFormat" v-model="vote.StartTime"  width="30%" floatLabelType="Auto" class="e-input" placeholder="זמן התחלה"></ejs-timepicker>
                  </div> 
                  <div class="dateContiner">
                    <ejs-datepicker width="60%" :serverTimezoneOffset="{timezone}" locale="en-US" format="dd/MM/yyyy" v-model="vote.ExpDate" :min="new Date()" :value="vote.ExpDate" floatLabelType="Auto" class="e-input" placeholder="תאריך תפוגה"></ejs-datepicker>
                    <ejs-timepicker step="5" :min="minTime" :max="maxTime" locale="he" :format="timeFormat" v-model="vote.ExpTime"  width="30%" floatLabelType="Auto" class="e-input" placeholder="זמן תפוגה"></ejs-timepicker>
                  </div> 
              

               <ejs-textbox v-model="vote.Name"  floatLabelType="Auto" class="e-input"  placeholder="שם שאלון" ></ejs-textbox>    
               <ejs-dropdownlist  v-model="vote.Type" :value="vote.Type"  :dataSource='VoteType' @change="voteTypeChange" :popupHeight='height' :fields='VoteTypelocalFields' placeholder='בחר סוג שאלון'></ejs-dropdownlist>
                <div v-if="enalbeEmails" class="row">
                  <div class="col-xs-12 col-sm-12 col-lg-12 col-md-12">
                      <div class="e-input-group">
                          <input class="e-input" type="text" placeholder="הכנס דוא''ל'" id="InputEmail" name="InputEmail" v-model="sendTomodel" />
                          <span style="cursor: pointer;" class="e-icons e-plus" @click="addEmail()"></span>        
                      </div>
                  </div>
                </div>
                <div v-if="enalbeEmails" class="row" style="margin-left: auto;margin-right: auto;">
                  <div class="col-xs-12 col-sm-12 col-lg-12 col-md-12">
                    <ejs-chiplist ref="ChipRef" avatarIconCss="e-icon"  cssClass="e-outline" id="chip"  @delete="RemoveEmail"  enableDelete="true"></ejs-chiplist>
                  </div>              
                </div>
                <div class="row" style="margin-top: 37px;">
                 <h6 class="form-title" style="text-align: right;">הוסף הקדמה/הוראות לשאלון:</h6>
                  <ejs-richtexteditor ref="richtextRef"  :toolbarSettings="toolbarSettings" locale="he" name="voteDetails" :imageSelected="onSelect" :imageUploadFailed="onUploadFailed"  :imageUploading= "addHeaders" :imageRemoving= "addHeaders"  v-bind:value="vote.Details"  endableRtl="true" :insertImageSettings="insertImageSettings"  id="name" v-model="vote.Details" ></ejs-richtexteditor>
                </div>
             </div>
            </div>
          </div>
      
          <div class="tab">
              <h4 class="form-title">הוספת שאלות</h4>

          <div id="BuildVoteQuetsion" class="form-group form-style" style="padding-top: 11px" v-for="(question, index) in vote.VoteQuestions" :key="index">
                 <ejs-tooltip v-if="question" :id="`tooltip[${index}]`" class="tooltipcontainer delteQuestionIcon" content='מחק שאלה' position="TopCenter" target=".e-delete-1">
                           <span :id="`removeQ[${index}]`"  @click="removequestion(index)" class="e-input-group-icon e-delete-1"></span>
                            <span>{{index+1}}</span>
                                  <ejs-tooltip v-if="question" :id="`tooltip[${index}]`" class="tooltipcontainer dublicateQuestionIcon" content='שכפל שאלה' position="TopCenter" target=".e-copy-2">
                           <span :id="`dublicateQ[${index}]`"  @click="dublicateQuestion(index)" class="e-input-group-icon e-copy-2"></span>
                   </ejs-tooltip> 
                   </ejs-tooltip>
                   
            <div class="e-float-input" style="text-align: left;">
                <div v-if="question.enableSwitch">
                  <label   :for="`checked[${index}]`" style="padding: 10px 70px 10px 0"> אפשר בחירה מרובה </label>
                  <ejs-switch  @change="switchCange($event,index)"  :id="`checked[${index}]`" enableRtl="true" v-model="question.allowMultiSelection" :checked="question.allowMultiSelection"></ejs-switch>
                    <div v-if="question.allowMultiSelection" class="row" style="flex-direction: row-reverse;">
                       <ejs-dropdownlist width="27%"  :id="`maxselect-${index}`" v-model="question.MaxSelection" :value='question.MaxSelection' :dataSource='maxSelectionDataSource'  :popupHeight='height' :fields='maxSelectionFields' placeholder='כמות תשובות לבחירה'></ejs-dropdownlist>

                    </div>

               </div>
                  <ejs-textbox v-model="question.text" :value="question.text" :id="`questions[${index}]`" :name="`questions[${index}]`" floatLabelType="Auto" class="e-input" @change="questionTextChanged(index)"  :placeholder="question.placeholder" ></ejs-textbox>          
                  <b v-if="question.error" class="e-error">שדה חובה </b>
            </div>
            <div class="e-float-input" v-for="(answer, jndex) in question.questionAnswers" :key="jndex">
                <div class="e-input-group e-float-icon-left">
                  <ejs-checkbox @change="checkBoxChange(index,jndex)" v-if="answer.type==='checkbox' || answer.type==='radio'" v-model="answer.text" :label="answer.placeholder" :name="`question[${jndex}]`" :id="`question[${jndex}]`"></ejs-checkbox>
                  <ejs-textbox v-if="answer.type==='text'" v-model="answer.text" floatLabelType="Auto" :name="`question[${jndex}]`" :id="`question[${jndex}]`" :placeholder="answer.placeholder"></ejs-textbox>
                  <ejs-numerictextbox v-if="answer.type==='number'" v-model="answer.text" floatLabelType="Auto" :name="`question[${jndex}]`" :id="`question[${jndex}]`" :placeholder="answer.placeholder"></ejs-numerictextbox>
                  <!-- <ejs-radiobutton v-if="answer.type==='radio'" v-model="answer.text" :label="answer.placeholder" :name="`question[${jndex}]`" :id="`question[${jndex}]`"  :value="answer.text" ></ejs-radiobutton> -->
                  <ejs-tooltip class="tooltipcontainer" v-bind:style= "[answer.type==='text' ? 'padding-top: 13px;' : '']"  content='מחק תשובה' position="TopLeft" target=".e-delete-1">
                           <span :id="`remove[${jndex}]`" @click="removeAnswer(index,jndex)" class="e-input-group-icon e-delete-1"></span>
                   </ejs-tooltip>   
  
                </div>                 
            </div>
            <!-- Answers Controls -->
            <div class="form-group from-group-add-answer form-style">
                <input type="text" v-model="question.newAnswer" :name="`newAnswer-${index}`" :id="`newAnswer-${index}`"  class="e-input" placeholder="הכנס תשובה" >
                 <div  v-if="question.allowTypeSelection">
                 <ejs-dropdownlist  :id="`select-${index}`" v-model="question.selected" :value='question.selected' :dataSource='controlsTypes'  :popupHeight='height' :fields='localFields' placeholder='בחר סוג שדה'></ejs-dropdownlist>
                 </div>
                 <div class="submitBtn">
                  <button @click="addAnswer(index)" type="button" :id="`but-${index}`" class="btn btn-secondary">הוסף תשובה</button>
                 </div>
            </div>
          </div> 

         <div class="submitBtn" id="AddQuestionID">
          <!-- <button v-if="!isFinish" class="submit-btn e-btn" @click="handleSubmit" style="margin-left: 26%;" id="submit-btn">סיום</button>
          <button v-if="isFinish" class="submit-btn e-btn" @click="handleUUpdateSubmit" style="margin-left: 26%;" id="submit-btn">עדכן</button> -->
           <button @click="addquestion" type="button" class="submit-btn e-btn">הוסף שאלה</button>

        </div> 
          </div>
            <div style="overflow:auto;">
              <div id="WizardBottuns">
                <button type="button" style="float: right;" id="prevBtn" @click="Prev(-1)">הקודם</button>
                <button type="button"  style="float: left;" id="nextBtn" @click="next(1)">הבא</button>
              </div>
          </div>        
        </form>
         <div class="submitBtn">
          <a v-if="linkGuid" style="margin-top: 34px;" :href="`/display/${linkGuid}`" >לינק לשיתוף השאלון</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script  >
import { DropDownListComponent } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxComponent,SwitchComponent,ChipListComponent} from "@syncfusion/ej2-vue-buttons";
import { TextBoxComponent,NumericTextBoxComponent  } from "@syncfusion/ej2-vue-inputs";
import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
import { DatePickerComponent ,TimePickerComponent } from "@syncfusion/ej2-vue-calendars";
import voteService from "../services/vote.service";
import { RichTextEditorComponent, Toolbar, Link, Image, HtmlEditor, Table,Resize,QuickToolbar } from "@syncfusion/ej2-vue-richtexteditor";
import { L10n } from '@syncfusion/ej2-base';
import * as HE from "../../node_modules/@syncfusion/ej2-locale/src/he.json";
L10n.load({'he': {richtexteditor:HE.he.richtexteditor,'timepicker':HE.he.timepicker}});



export default {
  name: "Home",
  data() {
    return {
        timezone :new Date().getTimezoneOffset() / 60,
        timeFormat : 'HH:mm',
        minTime:new Date('3/8/2017 6:00'),
        maxTime:new Date('4/8/2017 23:00'),
      vote:{
        id:0,
        Name:'',
        StartDate:new Date(),
        StartTime:new Date().getTime(),
        ExpDate:new Date(),
        ExpTime:new Date().getTime(),
        UserID:'',
        Type:0,
        VoteQuestions:[],
        Details:'',
        sendTo:[],
        },
  
        enalbeEmails:false,
        sendTomodel:'',
        linkGuid:'',
      VoteType:[],
      maxSelectionDataSource:[{maxSelect:2,name:'2 תשובות'}],
      maxSelectionFields:{ text: 'name', value: 'maxSelect' },
      VoteTypelocalFields:{ text: 'name', value: 'type' },
      controlsTypes:[{Id:"checkbox",Name:"תיבת סימון"},{Id:"text",Name:"טקסט חופשי"},{Id:"number",Name:"שדה מספרי"}],
      localFields: { text: 'Name', value: 'Id' },
      content: "",
      currentTab :0,
      rtl: true,
      isFinish:false,
      insertImageSettings: {
          saveUrl: `${process.env.VUE_APP_APIURL}/Vote/UploadImage`,
          removeUrl:`${process.env.VUE_APP_APIURL}/Vote/RemoveImage`,
          path: "../Images/",
           display: 'inline'
      },
      toolbarSettings: {
        type: 'Scrollable',
        items: ['Bold', 'Italic', 'Underline',
         'Formats', 'FontSize', 'FontColor', 'BackgroundColor',
         '|',
       'FontName', 'Alignments', 'OrderedList', 'UnorderedList',
        'Outdent', 'Indent', '|',
        'CreateLink', 'Image',  '|', 'Undo', 'Redo'
      ],
    },
      currentToken:'',
    };
  },
  mounted() { 
   this.showTab(this.currentTab);
  var richtextToolBarEle=document.getElementById("name_toolbar_wrapper");
  if(richtextToolBarEle){
    richtextToolBarEle.style.removeProperty("height");
  }
  this.$refs.richtextRef.refreshUI();
  voteService.getVoteTypes().then((res)=>{
      if(res.data){
      
        this.VoteType=res.data;
      }
      }).catch( (error) =>{
      if (error.response && error.response.status ===401 ) {
          localStorage.setItem('MsgDisplay',"true");
          this.$store.dispatch('auth/logout');
          this.$router.push({ path: '/login' ,query:{Msg:"יש להתחבר מחדש"}});
      }
    });
    var user=JSON.parse(localStorage.getItem('user'));
          this.currentToken=user.token;
  },
  computed: {
    apiUrl(){
      return process.env.VUE_APP_APIURL
    }
  },
  components: {
      'ejs-dropdownlist' : DropDownListComponent,
      "ejs-checkbox": CheckBoxComponent,
      'ejs-textbox' : TextBoxComponent,
      'ejs-numerictextbox' : NumericTextBoxComponent,
      'ejs-tooltip' :TooltipComponent,
       'ejs-datepicker' : DatePickerComponent,
        "ejs-switch": SwitchComponent,
        "ejs-richtexteditor": RichTextEditorComponent,
         "ejs-chiplist": ChipListComponent,
   'ejs-timepicker' : TimePickerComponent,

   },
   methods: {
    showTab(n) {
          // This function will display the specified tab of the form...
          var x = document.getElementsByClassName("tab");
          x[n].style.display = "block";
          console.log(x[n]);
          //... and fix the Previous/Next buttons:
          if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
          } else {
            document.getElementById("prevBtn").style.display = "inline";
          }
          if (n == (x.length - 1)) {
            if(!this.isFinish)
              document.getElementById("nextBtn").innerHTML = "סיום";
            else
               document.getElementById("nextBtn").innerHTML = "עדכן";

          } else {
            document.getElementById("nextBtn").innerHTML = "הבא";
          }
          //... and run a function that will display the correct step indicator:
        },
    next(n){
                var Tabs = document.getElementsByClassName("tab");


               if (this.currentTab + n >= Tabs.length) {
                  // ... the form gets submitted:
                  this.currentTab=Tabs.length-1;
                 if(!this.isFinish)
                    this.handleSubmit();
                  else {
                    this.handleUUpdateSubmit();
                  }
                
                  return false;
                }
                else{
                  Tabs[this.currentTab].style.display = "none";
                   this.currentTab = this.currentTab + n;

                }
                this.showTab(this.currentTab);

        },
    Prev(n) {
          // This function will figure out which tab to display
          var Tabs = document.getElementsByClassName("tab");
          // Exit the function if any field in the current tab is invalid:
          // if (n == 1 && !validateForm()) return false;
              // if you have reached the end of the form...

        
            Tabs[this.currentTab].style.display = "none";
              this.currentTab = this.currentTab + n;

          // Hide the current tab:
          console.log("Prev",this.currentTab);
          
          // Increase or decrease the current tab by 1:
        
          // Otherwise, display the correct tab:
          this.showTab(this.currentTab);
       },
    voteTypeChange(args){
      if(args.itemData.type===1){
       this.enalbeEmails=true;
      }
      else{
       this.enalbeEmails=false;

      }
    },
    RemoveEmail(args){
      const index = this.vote.sendTo.indexOf(args.value, 0);
      if (index > -1) {
        this.vote.sendTo.splice(index, 1);
      }
    },
    addEmail(){
      var email = document.getElementById('InputEmail').value;
      var emailText=email;
      if(emailText.includes("@")){
        emailText=email.split('@')[0];
      }
     const chip={text:emailText,value:email};
      this.vote.sendTo.push(email);
      this.$refs.ChipRef.add(chip);
    },
    addHeaders(args) {
          if(args && args.currentRequest && this.currentToken)
            args.currentRequest.setRequestHeader('Authorization', 'Bearer ' + this.currentToken );
      }, 
    onUploadFailed(){
       this.$root.dangerToast("העלאת קובץ נכשלה אנא נסה שנית מאוחר יותר");
      },
    onSelect(args){
        if (args.event.type === 'drop' || args.event.type === 'change') {
          let allImages = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'bpg'];
          let files = args.filesData;
          let modifiedFiles = [];
          for (let file of files) {
          if (allImages.indexOf(file.type) === -1) {
              file.status = 'File type is not allowed';
              file.statusCode = '0';
              this.$root.dangerToast("יש לבחור קובץ תמונה בלבד");
          }
          modifiedFiles.push(file);
          }
          args.isModified = true;
      }},
    checkBoxChange(idx,jdx){
      this.vote.VoteQuestions[idx].questionAnswers[jdx].currnt=!this.vote.VoteQuestions[idx].questionAnswers[jdx].currnt;
    },
    switchCange(arars,index){

      this.vote.VoteQuestions[index].allowMultiSelection=arars.checked;
       for (let idx = 0; idx < this.vote.VoteQuestions[index].questionAnswers.length; idx++) {
              console.log(this.vote.VoteQuestions[index].questionAnswers[idx].type);
             if(this.vote.VoteQuestions[index].questionAnswers[idx].type==="radio" || this.vote.VoteQuestions[index].questionAnswers[idx].type==="checkbox")
             {
              if(this.vote.VoteQuestions[index].allowMultiSelection){
                  this.vote.VoteQuestions[index].questionAnswers[idx].type="radio";
                }
                else{
                this.vote.VoteQuestions[index].questionAnswers[idx].type="checkbox";

                }
             }
        }
       this.fillMaxAnswerSelection(index);
 
    },
    validCheckBoxs(idx){
      if(this.vote.VoteQuestions[idx].questionAnswers.some(e=>e.type==='checkbox' || e.type==='radio'))
      {
        this.vote.VoteQuestions[idx].enableSwitch=true;
      }
      else{
        this.vote.VoteQuestions[idx].allowMultiSelection=false;
          this.vote.VoteQuestions[idx].enableSwitch=false;
      }

        //enable or disable selection type of answer
      if(this.vote.VoteQuestions[idx].questionAnswers && this.vote.VoteQuestions[idx].questionAnswers.length>0){
        this.vote.VoteQuestions[idx].allowTypeSelection=false;
      }
      else{
        this.vote.VoteQuestions[idx].allowTypeSelection=true;
      }
    },
    fillMaxAnswerSelection(idx){
      console.log("start",this.vote.VoteQuestions[idx].questionAnswers.length);
       if(this.vote.VoteQuestions[idx].questionAnswers.length > 1 && this.vote.VoteQuestions[idx].allowMultiSelection){
          this.maxSelectionDataSource=[];
          for (let j = 1; j < this.vote.VoteQuestions[idx].questionAnswers.length; j++) {
            this.maxSelectionDataSource.push({
               name: ` ${j+1} תשובות`, maxSelect: j+1
            });
            
          }
        }
    },
    addAnswer (idx) {
      var answerValue=(this.vote.VoteQuestions[idx].newAnswer)?this.vote.VoteQuestions[idx].newAnswer:'הכנס תשובה';
      var answerType=this.vote.VoteQuestions[idx].selected;
      if(this.vote.VoteQuestions[idx].selected==="checkbox" && !this.vote.VoteQuestions[idx].allowMultiSelection)
        {
          answerType="radio";
        }
 
        this.vote.VoteQuestions[idx].questionAnswers.push({
        type: answerType,
        text: answerValue,
        placeholder:answerValue,
        currnt:false,
        
      });
           this.fillMaxAnswerSelection(idx);
    this.validCheckBoxs(idx);
    this.vote.VoteQuestions[idx].newAnswer='';
    },
    addquestion () {
        this.vote.VoteQuestions.push({
            type:'text',
            text:'',
            placeholder:'הכנס שאלה',
            questionAnswers:[],
            selected:'checkbox',
            allowMultiSelection:false,
            enableSwitch:false,
            allowTypeSelection:true,
            error:false,
            MaxSelection:1
        })
    },
    removeAnswer(questionIdx,answerJdx){
        this.vote.VoteQuestions[questionIdx].questionAnswers.splice(answerJdx,1);
         this.validCheckBoxs(questionIdx);
          try{
            var ele =document.getElementsByClassName('e-tooltip-wrap')[0];
            if(ele)
              ele.hidden=true;
          }catch(ex){
          console.log(ex); 
          }
      },
    removequestion(questionIdx){
        this.vote.VoteQuestions.splice(questionIdx,1);
         try{
            var ele =document.getElementsByClassName('e-tooltip-wrap')[0];
            if(ele)
              ele.hidden=true;
          }catch(ex){
          console.log(ex); 
          }
      },
    questionTextChanged(idx){
    
        this.vote.VoteQuestions[idx].error=false
    },
    dublicateQuestion(idx){
       const backupData = JSON.parse(JSON.stringify(this.vote.VoteQuestions[idx]));

      console.log("b",this.vote.VoteQuestions);
      this.vote.VoteQuestions.push(backupData);
      console.log("a",this.vote.VoteQuestions);
      
    },
    valitaionSubmit(){
      var res=true;
      for (let index = 0; index < this.vote.VoteQuestions.length; index++) {
        const element = this.vote.VoteQuestions[index];
          if(!element.text || element.text.length ===0){
                  this.vote.VoteQuestions[index].error=true;
                  res= false
          }  
          if((element.allowMultiSelection && element.questionAnswers.some(e=>e.type==='radio')) || (!element.allowMultiSelection && element.questionAnswers.some(e=>e.type==='checkbox') ))
              for (let jdx = 0; jdx < element.questionAnswers.length; jdx++) {
                this.vote.VoteQuestions[index].questionAnswers[jdx].type=(element.allowMultiSelection)?"checkbox":"radio";
              }
  
          
      }
      return res;
    },
    handleSubmit () {

      if(!this.valitaionSubmit()) return;
      this.vote.ExpTime=this.vote.ExpTime.toTimeString().split(" ")[0];
      this.vote.StartTime=this.vote.StartTime.toTimeString().split(" ")[0];

      var user=JSON.parse(localStorage.getItem('user'));
      this.vote.UserID= user.userId;
      //diff time zone 1 day
      //this.vote.ExpDate.setDate(this.vote.ExpDate.getDate() +1);
      voteService.createVote(this.vote).then((response)=>{
            if(response)
             {  
               this.linkGuid=response.data.response.guid;
               this.vote.id=response.data.response.id;
              this.$root.successToast(`שאלון מספר ${response.data.response.id} נוצר בהצלחה `);
              this.isFinish=true;
               document.getElementById("nextBtn").innerHTML = "עדכן";
             }
            //response.data.id && response.data.guid
        }).catch((err)=>{
          console.log(err);
          this.$root.dangerToast("שגיאה ביצירת שאלון");

        });
   
    },
    handleUUpdateSubmit(){
      this.vote.ExpTime=this.vote.ExpTime?.toTimeString().split(" ")[0];
      this.vote.StartTime=this.vote.StartTime?.toTimeString().split(" ")[0];
      var user=JSON.parse(localStorage.getItem('user'));
      this.vote.UserID= user.userId;
      //diff time zone 1 day
      //this.vote.ExpDate.setDate(this.vote.ExpDate.getDate() +1);
      voteService.updateVote(this.vote).then((response)=>{
            if(response)
             {  
               this.linkGuid=response.data.response.guid;
               this.vote.id=response.data.response.id;
              this.$root.successToast(`שאלון מספר ${response.data.response.id} עודכן בהצלחה `);
             }
            //response.data.id && response.data.guid
        }).catch((err)=>{
          console.log(err);
          this.$root.dangerToast("שגיאה בעדכון שאלון");

        });
    }
  },
  provide: {
richtexteditor: [Toolbar, Link, Image, HtmlEditor, Table,Resize,QuickToolbar ],
  }
};
</script>
<style>

@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-lists/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-richtexteditor/styles/material.css";
/* Hide all steps by default: */
.tab {
  display: none;
}
#name_toolbar_FontColor_Target , #name_toolbar_BackgroundColor_Target{
  display: none;
}
button {
  background-color: #282928;
  color: #ffffff;
  border: none;
  padding: 2px 24px;
  font-size: 17px;
  font-family: Raleway;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

#prevBtn {
  background-color: #bbbbbb;
}

.e-chip-avatar.e-icon {
  font-family: "e-user-icon";
}
 #name_toolbar_wrapper{
      height: 42px ;
       /* width: auto !important;  */
} 
.e-chip-avatar.e-icon:before {
  content: "\e700";
}
@font-face {
  font-family: "e-user-icon";
  src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMj0gSRgAAAEoAAAAVmNtYXDnEOdaAAABjAAAADhnbHlmiAnWagAAAcwAAADwaGVhZBD04psAAADQAAAANmhoZWEHiwNuAAAArAAAACRobXR4C9AAAAAAAYAAAAAMbG9jYQAwAHgAAAHEAAAACG1heHABDwA1AAABCAAAACBuYW1lby+ImAAAArwAAAIxcG9zdGUbI4AAAATwAAAAOwABAAADUv9qAFoEAAAAAAAD3QABAAAAAAAAAAAAAAAAAAAAAwABAAAAAQAAWW9ja18PPPUACwPoAAAAANb8zuYAAAAA1vzO5gAAAAAD3QPqAAAACAACAAAAAAAAAAEAAAADACkAAgAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAQPwAZAABQAAAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5wDnAQNS/2oAWgPqAJYAAAABAAAAAAAABAAAAAPoAAAD6AAAAAAAAgAAAAMAAAAUAAMAAQAAABQABAAkAAAABAAEAAEAAOcB//8AAOcA//8AAAABAAQAAAABAAIAAAAAADAAeAACAAAAAAO+A+oADQAZAAA3FBYXIT4BNS4BJyEOARMeARc+ATcuAScOAS4YFwMzFxgDq4H+zYGr4QOCY2KCAwOCYmGCnCtOISFOK3qiAwOiAe1igwICg2JjggICggAAAAACAAAAAAPdA+oAFAAoAAABDgEHIicjDgEHLgEnLgEnPgE3HgEFFBYfARYfATcXFhc2JDcmJCcGBAOkBfK3KioXEFcpBBEMRUsBBfK3tvL8cVRLDggBBsQKLDDPARMFBf7tz87+7QI+ndEEBwI/Izh2DS+RVZ3RBATRnWCmN3BIETecAgcBBPK1tfIEBPIAAAAAABIA3gABAAAAAAAAAAEAAAABAAAAAAABAAgAAQABAAAAAAACAAcACQABAAAAAAADAAgAEAABAAAAAAAEAAgAGAABAAAAAAAFAAsAIAABAAAAAAAGAAgAKwABAAAAAAAKACwAMwABAAAAAAALABIAXwADAAEECQAAAAIAcQADAAEECQABABAAcwADAAEECQACAA4AgwADAAEECQADABAAkQADAAEECQAEABAAoQADAAEECQAFABYAsQADAAEECQAGABAAxwADAAEECQAKAFgA1wADAAEECQALACQBLyBDb250YWN0c1JlZ3VsYXJDb250YWN0c0NvbnRhY3RzVmVyc2lvbiAxLjBDb250YWN0c0ZvbnQgZ2VuZXJhdGVkIHVzaW5nIFN5bmNmdXNpb24gTWV0cm8gU3R1ZGlvd3d3LnN5bmNmdXNpb24uY29tACAAQwBvAG4AdABhAGMAdABzAFIAZQBnAHUAbABhAHIAQwBvAG4AdABhAGMAdABzAEMAbwBuAHQAYQBjAHQAcwBWAGUAcgBzAGkAbwBuACAAMQAuADAAQwBvAG4AdABhAGMAdABzAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAHUAcwBpAG4AZwAgAFMAeQBuAGMAZgB1AHMAaQBvAG4AIABNAGUAdAByAG8AIABTAHQAdQBkAGkAbwB3AHcAdwAuAHMAeQBuAGMAZgB1AHMAaQBvAG4ALgBjAG8AbQAAAAACAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBAgEDAQQABHVzZXIKY2hhdC0wMS13ZgAAAA==)
    format("truetype");
  font-weight: normal;
  font-style: normal;
}

.e-input-group{
      display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
}
.e-float-input, .e-float-input.e-control-wrapper{
  margin-top:11px;
}
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
  max-width: 67vh;
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
  .e-copy-2:before {
    content: "\e280";
       font-family: e-icons;
        font-size: 14px;
  }
     .e-copy-2:hover {
      color: rgb(231, 194, 139) !important;
      cursor: pointer;
    }
    .delteQuestionIcon{
        display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: space-between;
    }
    .dateContiner{
          display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: space-between;
    justify-content: space-between;
    align-items: flex-end;
    }
    .e-timepicker.e-popup {
        min-width:  18vh !important;
      }
</style>