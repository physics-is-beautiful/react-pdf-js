import React, { Component } from 'react';
import Pdf from 'react-pdf-js';

export default class App extends Component {
  state = {
    page: 1,
    zoomInButtonDisabled: false,
    zoomOutButtonDisabled: false,
  };

  static get zoomStep() { return 0.3; }

  onDocumentComplete = (pages) => {
    this.setState({ page: 1, scale: 1, pages });
  }

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext = () => {
    this.setState({ page: this.state.page + 1 });
  }

  onScaleUpdated = (scale, zoomInButtonDisabled, zoomOutButtonDisabled) => {
    this.setState({ scale, zoomInButtonDisabled, zoomOutButtonDisabled });
  }

  handleZoom = (zoom) => {
    let resetButtonState = { zoomInButtonDisabled: false, zoomOutButtonDisabled: false }
    if (zoom === '-') {
      this.setState({ scale: this.state.scale - App.zoomStep, ...resetButtonState });
    } else {
      this.setState({ scale: this.state.scale + App.zoomStep, ...resetButtonState });
    }
  }

  renderPagination = (page, pages, zoomInButtonDisabled, zoomOutButtonDisabled) => {
    let zoomButton = (
      <li className="zoom">
        <button onClick={this.handleZoom} className="btn btn-link" disabled={zoomInButtonDisabled}>
          zoom +
        </button>
      </li>
    );
    let zoomOutButton = (
      <li className="zoom">
        <button onClick={() => this.handleZoom('-')} className="btn btn-link" disabled={zoomOutButtonDisabled}>
          zoom -
        </button>
      </li>
    );
    let previousButton = (
      <li className="previous">
        <button onClick={this.handlePrevious} className="btn btn-link">
          Previous
        </button>
      </li>
    );
    if (page === 1) {
      previousButton = (
        <li className="previous disabled">
          <button className="btn btn-link">
            Previous
          </button>
        </li>
      );
    }
    let nextButton = (
      <li className="next">
        <button onClick={this.handleNext} className="btn btn-link">
          Next
        </button>
      </li>
    );
    if (page === pages) {
      nextButton = (
        <li className="next disabled">
          <button className="btn btn-link">
            Next
          </button>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pager">
          {zoomButton}
          {zoomOutButton}
          {previousButton}
          {nextButton}
        </ul>
      </nav>
    );
  }

  render () {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages,
        this.state.zoomInButtonDisabled, this.state.zoomOutButtonDisabled);
    }
    return (
      <div>
        {pagination}
        <Pdf
          file="test.pdf"
          onDocumentComplete={this.onDocumentComplete}
          page={this.state.page}
          scale={this.state.scale}
          onScaleUpdated={this.onScaleUpdated}
        />
      </div>
    );
  }
}
