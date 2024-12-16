# Brand Voice Analysis Tool

A Next.js application that analyzes content against Act-On's brand guidelines using AI to evaluate voice, tone, messaging alignment, and audience targeting.

## Overview

This tool helps ensure content consistency with Act-On's brand identity by analyzing:
- Voice and personality alignment
- Target audience focus
- Messaging values and framework alignment
- Overall brand fit
- Tone spectrum analysis
- Content adjustments and recommendations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system variables
- **AI Integration**: Anthropic Claude API for content analysis
- **Components**: Custom UI components with shadcn/ui integration
- **File Processing**: PDF parsing capabilities

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API route handlers
│   ├── fonts/           # Custom font files
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── lib/                # Core functionality
│   ├── services/       # Business logic and API services
│   ├── config/         # Configuration files
│   └── types/          # TypeScript type definitions
```

## Key Features

### Content Analysis
- Voice and personality evaluation
- Target audience alignment assessment
- Messaging values analysis
- Brand guideline compliance checking
- Tone spectrum analysis with adjustment recommendations

### User Interface
- Document input with platform selection
- Interactive analysis visualization
- Detailed evaluation breakdowns
- Priority adjustment recommendations
- Loading states and error handling

### Technical Features
- File parsing support
- API retry mechanism with exponential backoff
- Timeout handling for API calls
- Comprehensive type system
- Component-based architecture

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

## Usage

1. **Input Content**: Paste your content or upload a file in the main input area.
2. **Select Platform**: Choose the intended platform for your content.
3. **Add Goals** (optional): Specify content goals for more targeted analysis.
4. **Click Evaluate**: The system will analyze your content across multiple dimensions.
5. **Review Results**: Examine the detailed breakdown of:
   - Brand personality alignment
   - Voice characteristics
   - Tone spectrum position
   - Target audience focus
   - Messaging framework alignment
   - Overall brand fit
   - Specific recommendations for improvement

## API Integration

The application uses the Anthropic Claude API for content analysis. Key integration points:

- `evaluationService.ts`: Handles all API calls with retry logic
- `api/evaluate`: API route for content evaluation
- Timeout set to 55s to stay within function limits
- Exponential backoff for failed requests

## Component Architecture

### Core Components
- `DocumentInput`: Handles content input and platform selection
- `BrandPersonalitySection`: Displays personality alignment analysis
- `VoiceAnalysisSection`: Shows voice characteristic evaluation
- `ToneSpectrumSection`: Visualizes content tone positioning
- `TargetAudienceMatrix`: Displays audience focus analysis
- `MessagingValuesSection`: Shows messaging framework alignment
- `BrandEvaluationSection`: Presents overall evaluation and recommendations

### UI Components
- `Card`: Container component with consistent styling
- `LoadingButton`: Button with loading state
- `LoadingState`: Loading indicator with animated messages
- `CustomSelect`: Styled select dropdown
- `ScoreBar`: Visual representation of scores
- `Tooltip`: Contextual help tooltips

## Error Handling

The application includes comprehensive error handling:
- API timeout management
- Request retry logic
- User-friendly error messages
- Fallback states for failed evaluations

## Development Guidelines

1. **Type Safety**
   - Use TypeScript types for all components and functions
   - Maintain type definitions in `lib/types.ts`

2. **Component Structure**
   - Keep components focused and single-responsibility
   - Use composition for complex UI elements
   - Maintain consistent prop interfaces

3. **Styling**
   - Use Tailwind CSS utilities
   - Follow design system variables
   - Maintain responsive design principles

4. **Testing**
   - Include test data in `lib/test/`
   - Use mock evaluations for development
   - Test error handling scenarios