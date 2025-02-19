# Brand Voice Analysis Tool

A Next.js-based content analysis system that leverages the Claude API to evaluate content against Act-On's brand guidelines. The system performs multi-dimensional analysis of marketing content, providing detailed evaluation across voice, tone, audience targeting, and messaging alignment.

## System Architecture

### Core Components


### Tech Stack Details

- **Framework**: Next.js 14 with App Router
  - Server Components
  - API Routes
  - Static/Dynamic Rendering
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Variables
- **AI Integration**: Anthropic Claude 3.5 Sonnet
- **Component Library**: Custom + shadcn/ui
- **File Processing**: PDF.js + Custom Parsers

## Implementation Details

### AI Integration

```typescript
// API Configuration
const config = {
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 2048,
  temperature: 0.3,
  timeout: 55000, // 55s timeout
  retries: 2
};

// Rate Limiting
- 3 requests/second per provider
- Queue-based implementation
- Exponential backoff for retries
```

### Content Analysis Pipeline

1. **Input Processing**
   - Text sanitization
   - File parsing (PDF, DOC, TXT)
   - Platform context association

2. **Parallel Analysis**
   ```typescript
   const results = await Promise.all([
     evaluateVoicePersonality(content, platform),
     evaluateTargetAudience(content),
     evaluateMessagingValues(content),
     evaluateOverall(content, platform)
   ]);
   ```

3. **Evaluation Types**
   - Voice & Personality (0-100 scoring)
   - Target Audience Matrix
   - Messaging Framework Alignment
   - Tone Spectrum Analysis
   - Overall Brand Fit

### Component Architecture

```typescript
// Core Analysis Components
BrandPersonalitySection
VoiceAnalysisSection
ToneSpectrumSection
TargetAudienceMatrix
MessagingValuesSection
BrandEvaluationSection

// Base UI Components
Card                    // Container wrapper
ScoreBar               // Progress visualization
CustomSelect           // Platform selector
LoadingState           // Analysis status
```

### Error Handling Strategy

1. **API Layer**
   - Timeout management (55s limit)
   - Retry logic with exponential backoff
   - Provider failover (Claude → GPT-4)
   - Rate limiting protection

2. **Frontend Layer**
   - Loading states
   - Error boundaries
   - Fallback content
   - User feedback

3. **File Processing**
   - Format validation
   - Size limits
   - Parsing error recovery

## Type System

Key type definitions for analysis results:

```typescript
type Rating = 'strong' | 'moderate' | 'not_present' | 'needs_work';

interface EvaluationSection {
  rating: Rating;
  rationale: string;
  keyEvidence: string[];
}

interface ScoreBasedEvaluation {
  analysis: string;
  score: number;
}

// Complete evaluation structure
interface CompleteEvaluation {
  voicePersonality: VoicePersonalityEvaluation;
  targetAudience: TargetAudienceEvaluation;
  messagingValues: MessagingValuesEvaluation;
  overall: BrandEvaluation;
}
```

## Development Workflow

### Environment Setup

```bash
# Installation
npm install

# Environment Variables
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_backup_key_here  # Optional for failover

# Development
npm run dev         # Start dev server
npm run type-check  # Run type checking
npm run build      # Production build
```

### Testing Strategy

1. **Unit Tests**
   - Component rendering
   - Utility functions
   - Type validations

2. **Integration Tests**
   - API endpoints
   - Analysis pipeline
   - File processing

3. **Mock Data**
   - Test evaluations
   - Sample content
   - Error scenarios

### Performance Considerations

1. **API Optimization**
   - Response caching
   - Request batching
   - Parallel processing

2. **Frontend Performance**
   - Component memoization
   - Lazy loading
   - Progressive enhancement

3. **Error Recovery**
   - Graceful degradation
   - Fallback providers
   - Retry mechanisms

## Deployment

The application is deployed on Vercel with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  }
}
```

## Future Improvements

1. **Technical Enhancements**
   - WebSocket integration for real-time analysis
   - Browser-based PDF processing
   - Enhanced error recovery
   - Performance monitoring

2. **Feature Additions**
   - Batch processing
   - Analysis history
   - Collaborative editing
   - Export capabilities

3. **Architecture Evolution**
   - Microservices split
   - Queue-based processing
   - Enhanced caching
   - A/B testing framework