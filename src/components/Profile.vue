<template dir="rtl">
  <div  v-if="vote.voteQuestions.length===0" class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{userName}}</strong> Profile
      </h3>
    </header>

    <strong>שאלונים:</strong>
    <ejs-grid ref='grid' :dataSource='votes' :toolbar='toolbar' :editSettings='editSettings' :recordDoubleClick="fillChart"  :toolbarClick='clickHandler' >
        <e-columns>
            <e-column type='checkbox' width='50'></e-column>
            <e-column field='id' headerText='מספר' textAlign='Right'  width=70></e-column>
            <e-column field='name' headerText='שם' width=120></e-column>
            <e-column field='expDate' headerText='תאריך תפוגה' width=100 format='yMd' type='date' ></e-column>
            <e-column field='expTime' headerText='שעת תפוגה' width=100 ></e-column>
            <e-column field='startDate' headerText='תאריך התחלה' width=100 format='yMd' type='date' ></e-column>
            <e-column field='startTime' headerText='שעת התחלה' width=100 ></e-column>
        </e-columns>
 </ejs-grid>

  </div>
  <div v-if="vote.voteQuestions.length>0 && data.length>0">

    <h2 style="text-align: center;">{{vote.name}}</h2>
    <div v-html="vote.details" style="text-align: center;margin-top: 35px;"></div>
   <ejs-accumulationchart :legendSettings="legendSettings"  :enableRtl="true" >
    <e-accumulation-series-collection>
        <e-accumulation-series :dataSource='data' :dataLabel='datalabel' xName='x' yName='y' innerRadius="40%" :pointColorMapping=' pointColorMapping'> </e-accumulation-series>
    </e-accumulation-series-collection>
</ejs-accumulationchart>

  </div>

 <div v-if="vote.voteQuestions.length>0"  >
    <div  class="col-lg-12 control-section form-support">
      <div class="control_wrapper" id="control_wrapper">
        <form  id="form1" >
             <ejs-progressbar v-if="vote.type===1" ref="TotalAnswer" minimum=0 :maximum="vote.TotalAnswers" :secondaryProgress="vote.TotalAnswers" 
            :id="`TotalAnswer`"   type='Circular' :showProgressValue='vote.TotalAnswer>0' :labelStyle='vote.TotalAnswerlabel' :value='vote.TotalAnswer' :animation="animation" ></ejs-progressbar>

      
          <div  class="form-group form-style" style="padding-top: 11px" v-for="(question, index) in vote.voteQuestions" :key="index">
            <div class="e-float-input">
             <h5 style="direction: rtl;text-align: right;">{{question.text}} </h5>  
             <!-- <p v-if="question.maxSelection > 1" style="text-align: right;">ניתן לבחור עד {{question.maxSelection}} תשובות</p>         -->
            </div>
            <div class="e-float-input" v-for="(answer, jndex) in question.questionAnswers" :key="jndex" >
                <div  v-if="answer.answerGroup && answer.type==='text' || answer.type==='number' " >
                       <div class="e-input-group e-float-icon-left"  v-for="(answerGroup, k) in answer.answerGroup" :key="k" >
                          <div >{{answerGroup.name}}</div>
                         <ejs-progressbar  :ref="(el)=>{ProgBarrefs.push(el);}" :id="`per${jndex}-${index}-${k}`"  :trackThickness="34" :progressThickness="34"  height='30' width='100%' type='Linear' showProgressValue='true' :labelStyle='answer.label' :value='answerGroup.value' :animation="animation" ></ejs-progressbar>
                       </div>
       
             
                </div>      
                 <div v-else  class="e-input-group e-float-icon-left">
                   <div >{{answer.text}}</div>

                <ejs-progressbar v-if="answer.type==='radio' || answer.type==='checkbox'" :ref="(el)=>{ProgBarrefs.push(el);}" :id="`percentage${jndex}-${index}-${answer.id}`"  :trackThickness="34" :progressThickness="34"  height='30' width='100%' type='Linear' showProgressValue='true' :labelStyle='answer.label' :value='answer.progressBarValue' :animation="animation" ></ejs-progressbar>

                </div>        
            </div>
          </div>          
        </form>
        <div  class="submitBtn">
          <button class="submit-btn e-btn" @click="()=>{this.$router.go();}"  id="submit-btn">חזור</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script >

import UserService from "../services/user.service";
import { GridComponent, ColumnsDirective, ColumnDirective ,Toolbar} from '@syncfusion/ej2-vue-grids';
import voteService from '../services/vote.service';
 import { L10n,setCulture } from '@syncfusion/ej2-base';
 import he from "../../node_modules/@syncfusion/ej2-locale/src/he.json";
import { AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend,
PieSeries,AccumulationDataLabel  } from "@syncfusion/ej2-vue-charts";
import { ProgressBarComponent,ProgressAnnotation } from "@syncfusion/ej2-vue-progressbar";

export default {
  name: 'Profile',
  data() {
    return {
      ProgBarrefs:[],
      votes: [],
      userName:"",
      toolbar: [
      'Delete', 
      'Search',
      { text: 'צפייה', tooltipText: 'צפייה', prefixIcon: 'e-expand', id: 'View' },
      {text:'העתק קישור',prefixIcon:'e-link-2',id:'copylink'},
      { text: 'עריכה', tooltipText: 'עריכה', prefixIcon: 'e-edit', id: 'e-edit' }

    ],
      editSettings: {  allowEditing: true, allowDeleting: true, mode: 'Dialog'},
      languge : he,
      data: [],
      legendSettings: { visible: true },
      datalabel: { visible: true, name: 'text' },
      pointColorMapping: 'fill',
      vote:{voteQuestions:[]},
      animation: {
          enable: true,
          duration: 2000,
          delay: 0,
        },
   dateFormat: { type: 'date', format: 'HH:mm' }, 
      };
  },
  methods: {
    
   
    fillChart(args){
      this.data=[];
      if(args.rowData.voteQuestions.length===0)
          this.$root.warningToast(`השאלון שנבחר אינו מכיל שאלות`);      

      this.vote={name:args.rowData.name,details:args.rowData.details,voteQuestions:args.rowData.voteQuestions,TotalAnswers:0,type:args.rowData.type};
      for (let idx = 0; idx < this.vote.voteQuestions.length; idx++) {
        const element = this.vote.voteQuestions[idx];
          var TotalUserAnswers = 0
        this.vote.voteQuestions[idx].questionAnswers.forEach(element => {
           TotalUserAnswers+=element.voteAnswers.length;
        });
        this.vote.TotalAnswers+=TotalUserAnswers;
        for (let jdx = 0; jdx < element.questionAnswers.length; jdx++) {     
            const element2 = element.questionAnswers[jdx];

          if(element2.type==='radio' || element2.type==='checkbox'){
              const PercentAnswer=(element2.voteAnswers.length >0)?(element2.voteAnswers.length/TotalUserAnswers)*100:0;
              element2.progressBarValue=PercentAnswer;
              element2.label={ 
                             textAlignment: 'Center',
                             text: `${PercentAnswer}% ענו`,
                             color: '#ffffff',
                             fontWeight:'bold'
                             };
                this.data.push({
                x:element.text +" " + element2.text,
                y:element2.voteAnswers.length,
                text:element2.text 
              });
          }
          else{
              const elanswerDic=this.groupBy(element2.voteAnswers,"value");   
               const GroupByDic=[];
                  for (const [key, value] of Object.entries(elanswerDic)) {
                        
                        const PercentAnswer=(element2.voteAnswers.length >0)?(value.length/TotalUserAnswers)*100:0;
                         GroupByDic.push({value:PercentAnswer,name:key});
                         this.data.push({
                          x: element.text +" " +key,
                          y:value.length,
                          text:key
                        });
                      }
                       element2.answerGroup=GroupByDic;  
               }    
        }
      }
      if(args.rowData.type===1){
          if(args.rowData.userLinkeds.length >0){
                  this.vote.TotalAnswer=(this.vote.TotalAnswers/args.rowData.userLinkeds.length)*100;
                }
                else{
                  this.vote.TotalAnswer=0;
                }  
                this.vote.TotalAnswers=args.rowData.userLinkeds.length*100;
                var answerAmount=this.vote.TotalAnswers-this.vote.TotalAnswer;
                var color = (answerAmount>25)?"#EC6656":((answerAmount>50)?"#EC9D3E":"#C3E372");
                  this.vote.TotalAnswerlabel={ 
                  textAlignment: 'Center',
                  text: `${this.vote.TotalAnswer-1}% ענו`,
                  color: color,
                  fontWeight:'bold'
                  }
                if(this.vote.TotalAnswer===0){
                    this.vote.TotalAnswer=1;
                  this.vote.TotalAnswerlabel.text=`0% ענו`;
                }
      }
      
  
    },
      clickHandler: function(args) {
        if (args.item.prefixIcon === "e-delete") {
          console.log(this.$refs.grid.ej2Instances.getSelectedRecords());
          var Selected=this.$refs.grid.ej2Instances.getSelectedRecords();
          if(Selected.length>0){
            var ids=[];
            for (let idx = 0; idx < Selected.length; idx++) {
              ids.push(Selected[idx].id);
            }
            voteService.deleteVote(ids).then((res)=>{
                  if(res){
                     for (let idx = 0; idx < Selected.length; idx++) {
                        this.votes.splice(this.votes.indexOf(Selected[idx]), 1);

                      }
                  this.$root.successToast("נמחק בהצלחה");
                  this.$refs.grid.ej2Instances.dataSource = this.votes; 
                  }
            });
        
          }
          else
            this.$root.warningToast(`לא נבחרה רשומה`);      
        }

        if (args.item.id === "View"){
          var rowSelected=this.$refs.grid.ej2Instances.getSelectedRecords();
          if(rowSelected.length >0)
            this.fillChart({rowData:rowSelected[0]});
            else
                this.$root.warningToast(`לא נבחרה רשומה`);
        }
        if(args.item.id==="copylink"){
           var rowsSelected=this.$refs.grid.ej2Instances.getSelectedRecords();
            if(rowsSelected.length >0){
              navigator.clipboard.writeText(`${window.location.origin}/Display/${rowsSelected[0].linkGuid}`).then(() => {
            this.$root.successToast(`קישור עותק`);
          }).catch(err => {
            console.error('Could not copy text: ', err);
          });
            }
            else
                this.$root.warningToast(`לא נבחרה רשומה`);        
        }
        if(args.item.id=="e-edit"){
          var editRowsSelected=this.$refs.grid.ej2Instances.getSelectedRecords();
          console.log(editRowsSelected);
        }
    },
        groupBy(array, key){
          const result = {}
          array.forEach(item => {
            if (!result[item[key]]){
              result[item[key]] = []
            }
            result[item[key]].push(item)
          })
          return result
        }
        
  },
  components: {
  'ejs-grid' : GridComponent,
  'e-columns' : ColumnsDirective,
  'e-column' : ColumnDirective,
  "ejs-accumulationchart": AccumulationChartComponent,
  "e-accumulation-series-collection": AccumulationSeriesCollectionDirective,
  "e-accumulation-series":  AccumulationSeriesDirective,
      "ejs-progressbar": ProgressBarComponent

},
  computed: {
    currentUser() {
      return this.$store.state.auth.user;

    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  L10n.load({'he':{grid: this.languge.he.grid}});
  setCulture('he');

  UserService.getUserBoard().then(
      (response) => {
       this.votes = response.data.votes;
       this.userName= response.data.username;
      },
   
    ).catch( (error) =>{
    if (error.response && error.response.status ===401 ) {
        localStorage.setItem('MsgDisplay',"true");
        this.$store.dispatch('auth/logout');
        this.$router.push({ path: '/login' ,query:{Msg:"יש להתחבר מחדש"}});
    }

  });
  
  },
  provide: {
      grid: [Toolbar],
      accumulationchart: [AccumulationLegend, PieSeries, AccumulationDataLabel,ProgressAnnotation]

  }
};
</script>
<style>
  @import "../../node_modules/@syncfusion/ej2-vue-popups/styles/material.css";

.container{
  text-align: right;
  direction: rtl;
}
.jumbotron{
  text-align: center;
  padding:3%;
}
.answerRow{
    margin-right: 39px;
    margin-top: 6px;
} 
  #control-container {
        padding: 0px !important;
    }
    .linear-parent {
        text-align: center;
        margin-top: 7%;
    }
    .linear-button {
        text-align: center;
    }
    .linear-progress {
        width: 80%;
        margin: auto;
        margin-bottom: 3%;
    }
    #reLoad {
        border-radius: 4px;
        text-transform: capitalize;
    }
</style>