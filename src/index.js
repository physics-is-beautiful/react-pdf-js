/**
 * @class ReactPdfJs
 */
import PdfJsLib from 'pdfjs-dist';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ReactPdfJs extends Component {
  static propTypes = {
    file: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]).isRequired,
    page: PropTypes.number,
    onDocumentComplete: PropTypes.func,
    scale: PropTypes.number,
    cMapUrl: PropTypes.string,
    cMapPacked: PropTypes.bool,
    className: PropTypes.string,
    fitFullWidth: PropTypes.bool,
    maxWidth: PropTypes.number,
  }

  static defaultProps = {
    page: 1,
    onDocumentComplete: null,
    scale: 1,
    cMapUrl: '../node_modules/pdfjs-dist/cmaps/',
    cMapPacked: false,
    fitFullWidth: true,
    maxWidth: 100,
  }

  state = {
    pdf: null,
    renderTask: null,
  };

  componentDidMount() {
    const {
      file,
      onDocumentComplete,
      page,
      cMapUrl,
      cMapPacked,
    } = this.props;
    PdfJsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
    PdfJsLib.getDocument({ url: file, cMapUrl, cMapPacked }).then((pdf) => {
      this.setState({ pdf });
      if (onDocumentComplete) {
        onDocumentComplete(pdf._pdfInfo.numPages); // eslint-disable-line
      }
      pdf.getPage(page).then(p => this.drawPDF(p, true));
    });
  }

  componentWillReceiveProps(newProps) {
    const { page, scale } = this.props;
    const { pdf } = this.state;
    if (newProps.page !== page) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
    if (newProps.scale !== scale) {
      pdf.getPage(newProps.page).then(p => this.drawPDF(p));
    }
  }

  drawPDF = (page, inital = false) => {
    const { scale } = this.props;
    const { canvas } = this;

    let viewport;

    if (inital) {
      canvas.style.width = '100%';
      canvas.width = canvas.offsetWidth;
      viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
    } else {
      viewport = page.getViewport(scale);
    }

    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext,
      viewport,
    };

    if (this.state.renderTask) {
      this.state.renderTask.cancel();
    }

    const rTask = page.render(renderContext);
    this.setState({ renderTask: rTask });

    rTask.promise.then(() => {}, (reason) => {
      if (reason.name !== 'RenderingCancelledException') {
        throw reason;
      }
    });
  }

  render() {
    const { className } = this.props;
    return <canvas ref={(canvas) => { this.canvas = canvas; }} className={className} />;
  }
}
