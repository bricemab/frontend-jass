<template>
  <Loader v-if="isLoading"/>
  <div class="ideas">
    <h1>{{ $t("dashboard.ideas.ideas") }}</h1>
    <div class="info">{{$t('dashboard.ideas.ideasInfo')}}</div>
    <div class="input-field is-label max-width">
      <label>{{$t('dashboard.ideas.form.object')}} * <span style="font-size: 10px;">({{object.length}} / 255)</span></label>
      <input type="text" class="input is-light max-width" v-model="object" v-on:input="validObjectLenght" :placeholder="$t('dashboard.ideas.form.object')">
    </div>
    <div class="input-field is-label max-width">
      <label>{{$t('dashboard.ideas.form.content')}} *</label>
      <textarea  :placeholder="$t('dashboard.ideas.form.content')" v-model="content" class="input is-light max-width"></textarea>
    </div>
    <div class="is-label is-file">
      <label class="label-input">{{$t('dashboard.ideas.form.file')}}</label>
      <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
        <input
          type="file"
          name="file"
          multiple
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="file"
          accept=".pdf,.jpg,.jpeg,.png,.docx,.svg"
        />

        <label for="fileInput" class="file-label">
          <div v-html="$t('dashboard.ideas.form.fileInput')"></div>
        </label>
        <div class="preview-container" v-if="files.length">
          <div v-for="file in files" :key="file.name" class="preview-card">
            <div class="img">
              <img v-if="generateURL(file)" class="preview-img" :src="generateURL(file)" />
              <font-awesome-icon class="img preview-img" v-else icon="fa-solid fa-file" />
            </div>
            <div class="data">
              <span>{{ file.name }}</span>
              <span>{{ Math.round(file.size / 1000) + "kb" }}</span>
            </div>
            <div class="close">
              <span class="icon fa" @click="remove(files.indexOf(file))"><font-awesome-icon icon="trash"/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-field is-label max-width is-checkbox is-on-line">
      <label class="label-input">{{$t('dashboard.ideas.form.feedback')}}</label>
      <label class="switch">
        <input type="checkbox" v-model="feedback">
        <span class="slider round"></span>
      </label>
    </div>
    <div class="send">
      <button class="primary is-small" @click="submitForm">{{$t('dashboard.ideas.form.send')}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Utils from '@/utils/Utils';
import Loader from '@/views/Loader.vue';

@Options({
  components: {
    Loader
  }
})
export default class IdeasPage extends Vue {
  public isDragging = false;
  public files: File[] = [];
  public object = '';
  public content = '';
  public feedback = false;
  public isLoading = false;

  validObjectLenght () {
    this.object = this.object.slice(0, 255);
  }

  async submitForm () {
    let isValid = true;
    if (this.object.trim() === '') {
      isValid = false;
      Utils.toastError('', Utils.translate('dashboard.ideas.errors.objectEmpty'));
    }
    if (this.content.trim() === '') {
      isValid = false;
      Utils.toastError('', Utils.translate('dashboard.ideas.errors.contentEmpty'));
    }

    if (!isValid) {
      return false;
    }
    this.isLoading = true;
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (let i = 0; i < this.files.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      formData.append('files', this.files[i]);
    }
    formData.append('object', this.object);
    formData.append('content', this.content);
    formData.append('feedback', this.feedback ? '1' : '0');
    const response = await Utils.postEncodedToBackend(
      '/ideas/new',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user-token': sessionStorage.getItem('token')
        }
      },
      true
    );

    this.isLoading = false;
    if (response.success) {
      this.files = [];
      this.object = '';
      this.content = '';
      let text = Utils.translate('dashboard.ideas.success.newIdea');
      text += this.feedback ? ' ' + Utils.translate('dashboard.ideas.success.newIdeaFeedback') : '';
      this.feedback = false;
      Utils.toastSuccess('', text);
    }
  }

  onChange () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.files = [...this.$refs.file.files];
  }

  dragover (e: any) {
    e.preventDefault();
    this.isDragging = true;
  }

  remove (i: number) {
    this.files.splice(i, 1);
  }

  generateURL (file: any) {
    const imgTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (!imgTypes.find(i => i === file.type)) {
      return false;
    }
    const fileSrc = URL.createObjectURL(file);
    setTimeout(() => {
      URL.revokeObjectURL(fileSrc);
    }, 1000);
    return fileSrc;
  }

  dragleave () {
    this.isDragging = false;
  }

  drop (e: any) {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$refs.file.files = e.dataTransfer.files;
    this.onChange();
    this.isDragging = false;
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.input-field input.input, .input-field textarea.input {
  width: calc(100% - 20px);
}
.dashboard-wrapper:has(.ideas) {
  overflow-x: auto;
  width: 100%;
  height: calc(100% - 120px);
  padding-top: 20px;
}
.input-field.is-label label {
  width: auto;
}
.input-field {
  align-items: initial;
}
.send {
  text-align: right;
  margin-top: 10px;
}
.label-input {
  display: block;
  font-weight: bold;
  width: 100%;
  margin: 10px 0;
}
.is-file {
  width: 100%;
}
.dropzone-container {
  background: $secondBg;
  width: 100%;
  border-radius: 10px;
}

.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.file-label {
  font-weight: initial;
  display: block;
  padding: 1rem;
  cursor: pointer;
}

.preview-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 5px;
}

.preview-card {
  transition: 0.4s;
  display: flex;
  background: $red;
  border-radius: 10px;
  padding: 5px;
  margin-left: 5px;
  .img {
    flex: 0 0 30px;
  }
  .close {
    width: 30px;
    font-size: 13px;
    justify-content: right;
    display: flex;
    align-items: center;
     > span {
       cursor: pointer;
     }
  }
  .data {
    flex: 6;
    margin: 0 10px;
    display: flex;
    font-size: 13px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    &>span:first-child {
      max-width: 200px;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
      overflow: hidden;
    }
    * {
      width: 100%;
      display: block;
    }
  }

}

.preview-img {
  width: 30px;
  height: 30px;
  border-radius: 5px;
}
</style>
