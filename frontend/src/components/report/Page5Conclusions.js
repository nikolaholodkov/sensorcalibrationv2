import React from 'react';

function Page5Conclusions({ reportData, updateReportData }) {
  return (
    <div>
      <h3>Page 5: Conclusions and References</h3>
      
      <div className="form-group">
        <label>Conclusions</label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Provide a summary of the calibration results and any observations
        </p>
        <textarea
          value={reportData.conclusions}
          onChange={(e) => updateReportData('conclusions', e.target.value)}
          rows="8"
          placeholder="e.g., The conductivity sensor was re-calibrated about 9 months after the previous calibration and adjustment. Although all the residuals were within the accuracy declared by the manufacturer, the computations performed at the higher temperatures exhibited residual values very close to the instrument accuracy; therefore, the coefficients were recomputed."
        />
      </div>

      <div className="form-group">
        <label>References</label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Editable text box with default reference
        </p>
        <textarea
          value={reportData.references}
          onChange={(e) => updateReportData('references', e.target.value)}
          rows="5"
        />
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e6f0ff', borderRadius: '4px' }}>
        <h4 style={{ color: '#003366', marginBottom: '1rem' }}>Report Summary</h4>
        <p><strong>Report Number:</strong> {reportData.report_number || 'Not set'}</p>
        <p><strong>Test Date:</strong> {reportData.test_date || 'Not set'}</p>
        <p><strong>Authors:</strong> {(reportData.authors || []).join(', ') || 'None selected'}</p>
        <p><strong>Lab Unit:</strong> {reportData.lab_unit || 'Not set'}</p>
        <p><strong>Equipment Selected:</strong> {(reportData.equipment_ids || []).length} items</p>
        <p><strong>Page 3 Measurements:</strong> {(reportData.page3_measurements || []).length} rows</p>
        <p><strong>Page 4 Measurements:</strong> {(reportData.page4_measurements || []).length} rows</p>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '4px' }}>
        <strong>Ready to submit?</strong>
        <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Click "Complete Report" below to finalize and save this calibration report, or "Save as Draft" to continue editing later.
        </p>
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Footnotes</h4>
      <div className="form-group">
        <textarea
          value={reportData.page5_footnotes || ''}
          onChange={(e) => updateReportData('page5_footnotes', e.target.value)}
          rows="3"
          placeholder="Optional footnotes for this page..."
        />
      </div>
    </div>
  );
}

export default Page5Conclusions;
