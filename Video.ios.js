var React = require('react-native');
var { StyleSheet, requireNativeComponent, PropTypes, NativeModules, } = React;

var VideoResizeMode = require('./VideoResizeMode');
var { extend } = require('lodash');

var VIDEO_REF = 'video';

var Video = React.createClass({
  propTypes: {
    /* Native only */
    src: PropTypes.object,
    seek: PropTypes.number,

    /* Wrapper component */
    source: PropTypes.object,
    resizeMode: PropTypes.string,
    repeat: PropTypes.bool,
    paused: PropTypes.bool,
    muted: PropTypes.bool,
    volume: PropTypes.number,
    rate: PropTypes.number,
    onLoadStart: PropTypes.func,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    onBuffer: PropTypes.func,
    onBufferEmpty: PropTypes.func,
    onBufferReady: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onProgress: PropTypes.func,
    onSeek: PropTypes.func,
    onEnd: PropTypes.func,
  },

  seek(time) {
    this.setNativeProps({seek: parseFloat(time)});
  },

  setSource(source) {
    this.setNativeProps({src: this._createSrc(source)});
  },

  setNativeProps(props) {
    this.refs[VIDEO_REF].setNativeProps(props);
  },

  _onLoadStart(event) {
    this.props.onLoadStart && this.props.onLoadStart(event.nativeEvent);
  },

  _onLoad(event) {
    this.props.onLoad && this.props.onLoad(event.nativeEvent);
  },

  _onError(event) {
    this.props.onError && this.props.onError(event.nativeEvent);
  },

  _onBuffer(event) {
    this.props.onBuffer && this.props.onBuffer(event.nativeEvent);
  },

  _onBufferEmpty(event) {
    this.props.onBufferEmpty && this.props.onBufferEmpty(event.nativeEvent);
  },

  _onBufferReady(event) {
    this.props.onBufferReady && this.props.onBufferReady(event.nativeEvent);
  },

  _onPlay(event) {
    this.props.onPlay && this.props.onPlay(event.nativeEvent);
  },

  _onPause(event) {
    this.props.onPause && this.props.onPause(event.nativeEvent);
  },

  _onProgress(event) {
    this.props.onProgress && this.props.onProgress(event.nativeEvent);
  },

  _onSeek(event) {
    this.props.onSeek && this.props.onSeek(event.nativeEvent);
  },

  _onEnd(event) {
    this.props.onEnd && this.props.onEnd(event.nativeEvent);
  },

  _createSrc(source) {
    var uri = source.uri;
    if (uri && uri.match(/^\//)) {
      uri = 'file://' + uri;
    }
    return {
      uri: uri,
      isNetwork: !!(uri && uri.match(/^https?:/)),
      isAsset: !!(uri && uri.match(/^(assets-library|file):/)),
      type: source.type || 'mp4'
    };
  },

  render() {
    var style = [styles.base, this.props.style];

    var resizeMode;
    if (this.props.resizeMode === VideoResizeMode.stretch) {
      resizeMode = NativeModules.VideoManager.ScaleToFill;
    } else if (this.props.resizeMode === VideoResizeMode.contain) {
      resizeMode = NativeModules.VideoManager.ScaleAspectFit;
    } else if (this.props.resizeMode === VideoResizeMode.cover) {
      resizeMode = NativeModules.VideoManager.ScaleAspectFill;
    } else {
      resizeMode = NativeModules.VideoManager.ScaleNone;
    }

    var nativeProps = extend({}, this.props, {
      style,
      resizeMode: resizeMode,
      src: this._createSrc(this.props.source),
      onVideoLoadStart: this._onLoadStart,
      onVideoLoad: this._onLoad,
      onVideoBuffer: this._onBuffer,
      onVideoBufferEmpty: this._onBufferEmpty,
      onVideoBufferReady: this._onBufferReady,
      onVideoPlay: this._onPlay,
      onVideoPause: this._onPause,
      onVideoProgress: this._onProgress,
      onVideoSeek: this._onSeek,
      onVideoEnd: this._onEnd,
      onVideoError: this._onError,
    });

    return <RCTVideo ref={VIDEO_REF} {... nativeProps} />;
  },
});

var RCTVideo = requireNativeComponent('RCTVideo', Video);

var styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

module.exports = Video;
