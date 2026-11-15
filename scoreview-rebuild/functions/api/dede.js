// ScoreView — Dede AI Assistant API Endpoint
// Uses Anthropic API for AI responses (matching existing staging setup)
// Env var: ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are Dede, the ScoreView AI assistant. ScoreView is a performance intelligence and governance platform with two modules:

1. ScoReviewHR (Pre-Appraisal): KPI validation against a 16-point compliance checklist and SMART rubric, competency management, 9-box talent grid placement, and a human-in-the-loop moderation panel with certification.

2. ScoReview (Post-Appraisal): Appraisal PDF ingestion, six-dimension analysis (rating distribution, self-manager gaps, evidence quality, KPI achievement, outlier detection, trend analysis), KPI-to-objective mapping, and strategic alignment tracking.

Key governance principles:
- AI proposes. Evidence informs. People decide.
- Never manufacture missing evidence.
- Separate evidence from inference (potential is never inferred from performance alone).
- Full audit trail on every decision.

Be helpful, concise, and professional. Guide users to request a demo at /request-demo.html when appropriate. Keep responses under 150 words unless asked for detail.`;

export async function onRequestPost({ request, env }) {
  try {
    const { message } = await request.json();

    if (!message || message.length > 2000) {
      return new Response(JSON.stringify({
        response: 'I apologize, I could not process that request. Please keep your message under 2000 characters.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If Anthropic API key is configured, use Claude
    if (env.ANTHROPIC_API_KEY) {
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message }]
        })
      });

      if (claudeResponse.ok) {
        const data = await claudeResponse.json();
        const responseText = data.content?.[0]?.text || 'I apologize, I could not generate a response.';
        return new Response(JSON.stringify({ response: responseText }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Fallback: local intelligent responses
    return new Response(JSON.stringify({
      response: getLocalResponse(message)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Dede API error:', error);
    return new Response(JSON.stringify({
      response: 'I apologize, I encountered an error. Please try again or contact us directly.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getLocalResponse(text) {
  const lower = text.toLowerCase();

  if (lower.includes('what') && (lower.includes('scoreview') || lower.includes('do'))) {
    return 'ScoreView is a performance intelligence and governance platform. We validate KPIs before appraisal cycles, review appraisal integrity after the cycle, and turn performance data into actionable insights. We have two modules: ScoReviewHR (pre-appraisal) and ScoReview (post-appraisal). Would you like to request a demo?';
  }
  if (lower.includes('kpi') && lower.includes('valid')) {
    return 'KPI validation in ScoReviewHR checks each KPI against a 16-point compliance checklist and SMART rubric. It scores specificity, measurability, outcome-orientation, data source availability, and time-bounds — all before the cycle begins. AI proposes scores, humans confirm. Would you like to see how it works?';
  }
  if (lower.includes('moderation')) {
    return 'The moderation panel in ScoReviewHR is a human-in-the-loop workspace where authorized reviewers calibrate ratings, resolve discrepancies, and certify scorecards. It includes rating-distribution analysis, outlier detection, and a full audit trail. Every decision is documented.';
  }
  if (lower.includes('demo') || lower.includes('request')) {
    return 'You can request a demo at /request-demo.html. Just fill in your name, organization, and email, and our team will reach out within 24 hours.';
  }
  if (lower.includes('scoReviewhr') || (lower.includes('sco') && lower.includes('review') && lower.includes('hr'))) {
    return 'ScoReviewHR is our pre-appraisal module. It validates KPIs, manages competencies, runs 9-box talent reviews, and provides a moderation panel for certification. It ensures your performance measures are trustworthy before the cycle begins.';
  }
  if (lower.includes('scoReview') && !lower.includes('hr')) {
    return 'ScoReview is our post-appraisal module. It ingests appraisal PDFs, extracts structured data, runs six-dimension analysis, maps KPIs to objectives, and tracks strategic alignment. It turns completed appraisals into actionable intelligence.';
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
    return 'Pricing depends on your organization size and which modules you need. Please request a demo and our team will provide a tailored quote. Visit /request-demo.html to get started.';
  }
  if (lower.includes('security') || lower.includes('privacy') || lower.includes('data')) {
    return 'ScoreView takes data governance seriously. AI proposes, evidence informs, people decide. We never manufacture missing evidence, and every AI output is advisory with a full audit trail. See our /security.html page for details.';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! I\'m Dede, your ScoreView AI assistant. I can help you understand our platform, explore features, or guide you to request a demo. What would you like to know?';
  }
  if (lower.includes('9-box') || lower.includes('nine') || lower.includes('talent grid')) {
    return 'The 9-box talent grid in ScoReviewHR places employees on a 3x3 grid using measured performance and independently assessed potential. This separates evidence from inference — potential is never inferred from performance alone. The result is data-driven, defensible talent decisions.';
  }
  if (lower.includes('pdf') || lower.includes('ingest') || lower.includes('upload')) {
    return 'ScoReview ingests appraisal PDFs in batches. The system parses each document and extracts structured data — employee, KPIs, ratings, evidence, and manager comments. Unclear values are flagged for review, never silently guessed.';
  }
  if (lower.includes('six') && lower.includes('dimension')) {
    return 'The six dimensions of post-appraisal analysis are: 1) Rating Distribution, 2) Self-Manager Gap, 3) Evidence Quality, 4) KPI Achievement, 5) Outlier Detection, and 6) Trend Analysis. Together they reveal what the ratings actually say about your organization.';
  }

  return 'That\'s a great question. I can help you understand ScoreView\'s KPI validation, appraisal review, moderation panel, 9-box talent grid, strategic alignment features, or guide you to request a demo. What interests you most?';
}
