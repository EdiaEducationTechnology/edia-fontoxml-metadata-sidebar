import React, {Component} from 'react';
import {Button, Flex, Form, FormRow, Label, List, Text, Icon, ListItem, SidebarHeader, SidebarInlay} from 'fds/components';
import selectionManager from 'fontoxml-selection/src/selectionManager.js'
import documentsManager from 'fontoxml-documents/src/documentsManager.js'
import './EdiaAnalysisSidebar.css';


export default class EdiaAnalysisSidebar extends Component {

  jwtApi = "API_KEY";
  jwtDemo = "DEMO_KEY";
  baseApiUrl = "https://api.edia.nl"
  baseDemoUrl = "https://demo.360.edia.nl"

  EMPTY_METADATA = {
    classification: '',
    topics: [],
    keywords: []
  };

  LIST_EMPTY_KEYWORDS = [{lemma: 'No keywords found', certainty: 1.0}];
  LIST_EMPTY_TOPICS = [{score: 1, topics: ['No topics found']}];

  constructor(props) {
    super(props);
    this.state = {
      metadata: JSON.parse(JSON.stringify(this.EMPTY_METADATA)), // .clone() in JS.
      isReady: false,
      isRunning: false
    };
  }

  startState() {
    this.setState({
      metadata: {
        classification: '',
        topics: [],
        keywords: []
      },
      isReady: false,
      isRunning: true
    });
  }

  getText() {
    var documentId = selectionManager.focusedDocumentId;
    let doc = documentsManager.getDocumentNode(documentId);
    let documentElement = doc.documentElement;
    return documentElement.textContent;
  }

  topicClassification(text, callback) {
    let self = this;
    let options = {
      method: "POST",
      body: JSON.stringify({text: text}),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + this.jwtDemo,
        "Content-Type": "application/json;charset=UTF-8"
      }
    };
    fetch(this.baseDemoUrl + "/api/v1/topic/classify/?numberOfResults=3", options)
      .then(response => response.json())
      .then(function (data) {
        let {metadata} = self.state;
        let topics = [];
        for (const i in data.topics) {
          const topic = data.topics[i];
          if (topic.score > .5) {
            topics.push(topic);
          }
        }
        if (topics.length === 0) {
          topics = self.LIST_EMPTY_TOPICS
        }
        metadata.topics = topics;
        self.setState({metadata: metadata})

      }).finally(() => {
      callback(text)
    });
  }

  cefrClassification(text, callback) {
    self = this;
    let url = this.baseApiUrl + "/v1/cefr?scale=9_CLASS";
    let options = {
      method: "post",
      body: JSON.stringify({text: text}),
      headers: {
        Accept: 'application/json',
        Authorization: "Bearer " + this.jwtApi,
        "Content-Type": "application/json; charset=UTF-8"
      }
    };
    fetch(url, options)
      .then(response => response.json())
      .then(function (data) {
        let result = data.result;
        let {metadata} = self.state;
        metadata.classification = result.cefr.name;
        self.setState({metadata: metadata});

      }).finally(() => {
      callback(text)
    });
  }


  keywordExtraction(text, callback) {
    self = this;
    let url = this.baseDemoUrl + "/api/v1/keywords/extract";
    let options = {
      method: "post",
      body: JSON.stringify({text: text}),
      headers: {
        Accept: 'application/json',
        Authorization: "Bearer " + this.jwtDemo,
        "Content-Type": "application/json; charset=UTF-8"
      }
    };
    fetch(url, options)
      .then(response => response.json())
      .then(function (data) {
        let {metadata} = self.state;
        metadata.keywords = data.clusters || self.LIST_EMPTY_KEYWORDS;
        self.setState({metadata: metadata})
      }).finally(() => {
      callback(text)
    });
  }

  handleClick(e) {
    const self = this;
    self.startState();
    let text = this.getText();
    self.cefrClassification(text, (text) => {
      self.topicClassification(text, (text) => {
        self.keywordExtraction(text, (text) => {
          self.setState({isReady: true, isRunning: false})
        })
      })
    });
    e.preventDefault();
  }

  renderTopicItem(item, index) {
    const topics = item.topics || [];
    return <List key={index} items={topics} renderItem={(topic) => {
      let isBold = topic.key == topics.length - 1;
      return <ListItem key={index + '' + topic.key}><Label isBold={isBold}>{topic.item}</Label></ListItem>
    }}/>

  }

  renderFull(metadata, isRunning) {
    const self = this;
    const icon = isRunning ? 'spinner' : 'newspaper-o';
    return (
      <Flex flexDirection="column">
        <SidebarHeader subtitle="EDIA Content Analysis" title="Analysis"/>
        <SidebarInlay>
          <Flex flexDirection="column">
            <Form labelPosition="before">
              <FormRow label="CEFR">
                <List items={[metadata.classification]} renderItem={(item) =>
                  <ListItem key={item.key}><Label isBold={true}>{item.item}</Label></ListItem>
                }/>
              </FormRow>
              <FormRow label="Topics">
                {this.items = metadata.topics.map((item, index) =>
                  self.renderTopicItem(item, index)
                )}
              </FormRow>
              <FormRow label="Keywords">
                <List items={metadata.keywords} renderItem={(item) =>
                  <ListItem key={item.key}><Label>{item.item.lemma}</Label></ListItem>
                }/>
              </FormRow>
              <Flex>
                <FormRow label="">
                  <Button
                    type="primary" icon={icon} name="analyze" label={"Analysis"} onClick={function (e) {
                    self.handleClick(e)
                  }}
                  />
                </FormRow>
              </Flex>
            </Form>
          </Flex>
        </SidebarInlay>
        <Flex>&nbsp;</Flex>
        <SidebarInlay>
          <Flex flexDirection="column" >
            {/*  <Icon icon={"info"} size={"s"}></Icon>*/}
            <Text>
              <p>Dear user,</p>
              <p>This functionality allows for automated metadata tagging of CEFR readability, topics,
                and keywords. For now, this service only works for the <b class="lang">English</b> language. <b class="lang">Dutch</b> will be added soon.</p>
              <p>
                Kind regards,
              </p>
              <p>
                The EDIA development team.
              </p>
              <p>&nbsp;</p>
            </Text>
          </Flex>
        </SidebarInlay>
      </Flex>
    );
  }

  render() {
    const self = this;
    const {metadata, isReady, isRunning} = this.state;
    if (isReady) {
      return self.renderFull(metadata, isRunning);
    }
    return self.renderFull(this.EMPTY_METADATA, isRunning);
  }
}
