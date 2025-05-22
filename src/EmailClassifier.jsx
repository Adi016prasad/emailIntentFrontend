import { useState } from 'react';
import { Sparkles, MailSearch, FileText, Loader2, CheckCircle } from 'lucide-react';

export default function EmailClassifier() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClassify = async () => {
    if (!subject.trim() && !body.trim()) {
      alert("Please enter email subject or body");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          body: body
        }),
      });

      if (!response.ok) {
        throw new Error('Classification failed');
      }

      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during classification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-classifier-container">
      <div className="email-classifier-card">
        <h1 className="email-classifier-title">
          <Sparkles className="icon icon-yellow" />
          Email Intent Classifier
        </h1>

        <div className="email-classifier-form">
          <label htmlFor="subject" className="email-classifier-label">
            <MailSearch className="icon icon-cyan" />
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className="email-classifier-input"
          />

          <label htmlFor="body" className="email-classifier-label">
            <FileText className="icon icon-pink" />
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter email content..."
            rows={8}
            className="email-classifier-textarea"
          />
        </div>

        <div className="email-classifier-button-container">
          <button
            onClick={handleClassify}
            disabled={isLoading}
            className="email-classifier-button"
          >
            <span className="email-classifier-button-overlay"></span>
            {isLoading ? (
              <>
                <Loader2 className="icon icon-white spinner" />
                Classifying...
              </>
            ) : (
              <>
                <MailSearch className="icon icon-white" />
                Classify Email
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="email-classifier-result">
            <h2 className="email-classifier-result-title">
              <Sparkles className="icon icon-green" />
              Classification Result:
            </h2>
            <div className="email-classifier-result-content">
              <CheckCircle className="icon icon-green" />
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}