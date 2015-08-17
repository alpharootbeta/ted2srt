import utils from '../models/util';

export class TalkView {
  constructor() {
    this.$talkInfo = document.getElementById('talk-info');
    this.$languages = document.querySelector('#languages ul');
    this.$watch = document.getElementById('watch');
    this.$playerContainer = document.getElementById('player-container');
    this.$video = document.getElementById('video');
    this.$transcripts = document.querySelector('#subtitles ul');

    this.templateInfo = document.getElementById('talk-info.html').innerHTML;
    this.templateDownloads = document.getElementById('video-downloads.html').innerHTML;

    this.$playerContainer.addEventListener('click', this.closeVideo);
  }

  bind(event, handler) {
    if (event === 'selectLang') {
      this.delegate(this.$languages, 'li', 'click', function (e) {
        handler(this.dataset.code);
      });
    } else if (event === 'watch') {
      this.$watch.addEventListener('click', handler);
    } else if (event === 'download') {
      this.$transcripts.addEventListener('click', (e) => {
        handler(e.target.id);
      });
    }
  }

  playVideo(talk, selected) {
    var template = `
      <video controls autoplay>
        <source src="{{video_src}}" type="video/mp4">
        <track kind="captions" src="{{vtt_src}}" default>
      </video>
      `;
    if (utils.isSafari()) {
      this.$playerContainer.style.display = '-webkit-flex';
    } else {
      this.$playerContainer.style.display = 'flex';
    }
    this.$playerContainer.innerHTML =
      template.replace('{{video_src}}', utils.mkVideoUrl(talk.mSlug, '950k'))
              .replace('{{vtt_src}}', utils.mkTranscriptUrl(talk.id, selected, 'vtt', false));
  }

  closeVideo(event) {
    if (event.target === this) {
      this.style.display = 'none';
      this.innerHTML = '';
    }
  }

  delegate(target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = target.querySelectorAll(selector);
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) !== -1;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    target.addEventListener(type, dispatchEvent);
  }

  toggle(langCode) {
    let li = document.querySelector(`li[data-code="${langCode}"]`);
    li.classList.toggle('selected');
  }

  downloadTranscript(talk, selected, format) {
    document.location = utils.mkTranscriptUrl(talk.id, selected, format, true);
  }

  renderInfo(talk) {
    const talkUrl = `https://www.ted.com/talks/${talk.slug}`,
          publishedAt = utils.pprDate(talk.publishedAt);

    this.$talkInfo.innerHTML =
      this.templateInfo.replace(/{{talkUrl}}/g, talkUrl)
                       .replace('{{name}}', talk.name)
                       .replace('{{src}}', talk.images.medium)
                       .replace('{{description}}', talk.description)
                       .replace('{{publishedAt}}', publishedAt);
  }

  renderLanguages(language, selected) {
    let li = document.createElement('li');
    li.dataset.code = language.code;
    li.innerHTML = language.name;
    this.$languages.appendChild(li);
    if (selected.indexOf(language.code) !== -1) {
      li.click();
    }
  }

  renderVideoDownloads(mediaSlug) {
    let mkVideoUrl = utils.mkVideoUrl.bind(this, mediaSlug);
    this.$video.innerHTML =
      this.templateDownloads.replace('{{1500k}}', mkVideoUrl('1500k'))
                            .replace('{{950k}}', mkVideoUrl('950k'))
                            .replace('{{600k}}', mkVideoUrl('600k'))
                            .replace('{{320k}}', mkVideoUrl('320k'));
  }

  render(talk, selected) {
    document.title = talk.name + ' - TED2srt';
    this.renderInfo(talk);
    talk.languages.forEach((lang) => {
      this.renderLanguages(lang, selected);
    });
    this.renderVideoDownloads(talk.mSlug);
  }
};