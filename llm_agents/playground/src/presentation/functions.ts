export const tools = [
  // 01 Section divider
  {
    type: "function" as const,
    function: {
      name: "createSectionDividerPage",
      description: "Create a section divider page with a large heading.",
      parameters: {
        type: "object",
        properties: {
          heading: { type: "string", description: "Main section title" },
          subheading: { type: "string", description: "Optional subtitle" },
        },
        required: ["heading"],
      },
    },
  },

  // 02 Agenda
  {
    type: "function" as const,
    function: {
      name: "createAgendaPage",
      description: "Create an agenda page with bullet points.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          items: { type: "array", items: { type: "string" }, minItems: 1 },
        },
        required: ["items"],
      },
    },
  },

  // 03 Executive summary
  {
    type: "function" as const,
    function: {
      name: "createExecutiveSummaryPage",
      description: "Create an executive summary with 3–5 key points.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          bullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 7 },
        },
        required: ["bullets"],
      },
    },
  },

  // 04 Key message + supports
  {
    type: "function" as const,
    function: {
      name: "createKeyMessageWithSupportsPage",
      description: "Create a key message headline with supporting points.",
      parameters: {
        type: "object",
        properties: {
          headline: { type: "string" },
          supports: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["headline", "supports"],
      },
    },
  },

  // 05 Hypothesis
  {
    type: "function" as const,
    function: {
      name: "createHypothesisPage",
      description: "Create a hypothesis page with implications and next steps.",
      parameters: {
        type: "object",
        properties: {
          hypothesis: { type: "string" },
          implications: { type: "array", items: { type: "string" } },
          nextSteps: { type: "array", items: { type: "string" } },
        },
        required: ["hypothesis"],
      },
    },
  },

  // 06 Issue tree
  {
    type: "function" as const,
    function: {
      name: "createIssueTreePage",
      description: "Create an issue tree slide (MECE).",
      parameters: {
        type: "object",
        properties: {
          rootIssue: { type: "string" },
          branches: { type: "array", items: { type: "array", items: { type: "string" } }, minItems: 2 },
        },
        required: ["rootIssue", "branches"],
      },
    },
  },

  // 07 Driver tree
  {
    type: "function" as const,
    function: {
      name: "createDriverTreePage",
      description: "Create a business driver tree.",
      parameters: {
        type: "object",
        properties: {
          metric: { type: "string" },
          drivers: { type: "array", items: { type: "array", items: { type: "string" } }, minItems: 1 },
        },
        required: ["metric", "drivers"],
      },
    },
  },

  // 08 MECE list
  {
    type: "function" as const,
    function: {
      name: "createMeceListPage",
      description: "Create a MECE grouped bullet list.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          groups: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                items: { type: "array", items: { type: "string" }, minItems: 1 },
              },
              required: ["label", "items"],
            },
          },
        },
        required: ["groups"],
      },
    },
  },

  // 09 Pyramid principle
  {
    type: "function" as const,
    function: {
      name: "createPyramidPrinciplePage",
      description: "Create a pyramid principle (conclusion → reasons) page.",
      parameters: {
        type: "object",
        properties: {
          keyMessage: { type: "string" },
          supports: { type: "array", items: { type: "string" }, minItems: 2 },
          details: { type: "array", items: { type: "array", items: { type: "string" } } },
        },
        required: ["keyMessage", "supports"],
      },
    },
  },

  // 10 SCQA
  {
    type: "function" as const,
    function: {
      name: "createScqaPage",
      description: "Create a SCQA (Situation, Complication, Question, Answer) storyline page.",
      parameters: {
        type: "object",
        properties: {
          situation: { type: "string" },
          complication: { type: "string" },
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["situation", "complication", "question", "answer"],
      },
    },
  },

  // 11 SWOT
  {
    type: "function" as const,
    function: {
      name: "createSwotPage",
      description: "Create a SWOT matrix.",
      parameters: {
        type: "object",
        properties: {
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
          opportunities: { type: "array", items: { type: "string" } },
          threats: { type: "array", items: { type: "string" } },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"],
      },
    },
  },

  // 12 3C
  {
    type: "function" as const,
    function: {
      name: "createThreeCPage",
      description: "Create a 3C (Company, Customer, Competitor) page.",
      parameters: {
        type: "object",
        properties: {
          company: { type: "array", items: { type: "string" } },
          customer: { type: "array", items: { type: "string" } },
          competitor: { type: "array", items: { type: "string" } },
        },
        required: ["company", "customer", "competitor"],
      },
    },
  },

  // 13 4P
  {
    type: "function" as const,
    function: {
      name: "createFourPPage",
      description: "Create a marketing 4P page.",
      parameters: {
        type: "object",
        properties: {
          product: { type: "array", items: { type: "string" } },
          price: { type: "array", items: { type: "string" } },
          place: { type: "array", items: { type: "string" } },
          promotion: { type: "array", items: { type: "string" } },
        },
        required: ["product", "price", "place", "promotion"],
      },
    },
  },

  // 14 7S
  {
    type: "function" as const,
    function: {
      name: "createSevenSPage",
      description: "Create a McKinsey 7S page.",
      parameters: {
        type: "object",
        properties: {
          strategy: { type: "string" },
          structure: { type: "string" },
          systems: { type: "string" },
          sharedValues: { type: "string" },
          skills: { type: "string" },
          style: { type: "string" },
          staff: { type: "string" },
        },
        required: ["strategy", "structure", "systems", "sharedValues", "skills", "style", "staff"],
      },
    },
  },

  // 15 Value chain
  {
    type: "function" as const,
    function: {
      name: "createValueChainPage",
      description: "Create a value chain with primary and support activities.",
      parameters: {
        type: "object",
        properties: {
          primary: { type: "array", items: { type: "string" }, minItems: 3 },
          support: { type: "array", items: { type: "string" }, minItems: 3 },
        },
        required: ["primary", "support"],
      },
    },
  },

  // 16 Five forces
  {
    type: "function" as const,
    function: {
      name: "createPorterFiveForcesPage",
      description: "Create a Porter’s Five Forces page.",
      parameters: {
        type: "object",
        properties: {
          newEntrants: { type: "array", items: { type: "string" } },
          suppliers: { type: "array", items: { type: "string" } },
          buyers: { type: "array", items: { type: "string" } },
          substitutes: { type: "array", items: { type: "string" } },
          rivalry: { type: "array", items: { type: "string" } },
        },
        required: ["newEntrants", "suppliers", "buyers", "substitutes", "rivalry"],
      },
    },
  },

  // 17 Business model canvas
  {
    type: "function" as const,
    function: {
      name: "createBusinessModelCanvasPage",
      description: "Create a Business Model Canvas (9 blocks).",
      parameters: {
        type: "object",
        properties: {
          blocks: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } },
        },
        required: ["blocks"],
      },
    },
  },

  // 18 Customer journey
  {
    type: "function" as const,
    function: {
      name: "createCustomerJourneyPage",
      description: "Create a customer journey with stages and touchpoints.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          touchpoints: { type: "array", items: { type: "array", items: { type: "string" } } },
        },
        required: ["stages"],
      },
    },
  },

  // 19 Stakeholder map
  {
    type: "function" as const,
    function: {
      name: "createStakeholderMapPage",
      description: "Create a stakeholder influence-interest map.",
      parameters: {
        type: "object",
        properties: {
          stakeholders: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                influence: { type: "number" },
                interest: { type: "number" },
                notes: { type: "string" },
              },
              required: ["name", "influence", "interest"],
            },
          },
        },
        required: ["stakeholders"],
      },
    },
  },

  // 20 RACI
  {
    type: "function" as const,
    function: {
      name: "createRaciPage",
      description: "Create a RACI matrix.",
      parameters: {
        type: "object",
        properties: {
          tasks: { type: "array", items: { type: "string" }, minItems: 1 },
          roles: { type: "array", items: { type: "string" }, minItems: 1 },
          assignments: { type: "array", items: { type: "array", items: { type: "string" } } },
        },
        required: ["tasks", "roles"],
      },
    },
  },

  // 21 OKR/KPI dashboard
  {
    type: "function" as const,
    function: {
      name: "createOkrKpiDashboardPage",
      description: "Create an OKR/KPI dashboard with tiles.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          metrics: {
            type: "array",
            minItems: 3,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" },
                target: { type: "string" },
                status: { type: "string" },
              },
              required: ["label", "value"],
            },
          },
        },
        required: ["metrics"],
      },
    },
  },

  // 22 Balanced scorecard
  {
    type: "function" as const,
    function: {
      name: "createBalancedScorecardPage",
      description: "Create a balanced scorecard page.",
      parameters: {
        type: "object",
        properties: {
          perspectives: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                items: { type: "array", items: { type: "string" } },
              },
              required: ["name", "items"],
            },
          },
        },
        required: ["perspectives"],
      },
    },
  },

  // 23 Quarterly roadmap
  {
    type: "function" as const,
    function: {
      name: "createQuarterlyRoadmapPage",
      description: "Create a quarterly roadmap.",
      parameters: {
        type: "object",
        properties: {
          quarters: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                quarter: { type: "string" },
                label: { type: "string" },
              },
              required: ["quarter", "label"],
            },
          },
        },
        required: ["quarters", "items"],
      },
    },
  },

  // 24 Milestone timeline
  {
    type: "function" as const,
    function: {
      name: "createMilestoneTimelinePage",
      description: "Create a milestone timeline.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          milestones: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                date: { type: "string" },
                notes: { type: "string" },
              },
              required: ["label"],
            },
          },
        },
        required: ["milestones"],
      },
    },
  },

  // 25 Gantt (simple)
  {
    type: "function" as const,
    function: {
      name: "createGanttSimplePage",
      description: "Create a simple Gantt placeholder.",
      parameters: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                start: { type: "string" },
                end: { type: "string" },
              },
              required: ["name", "start", "end"],
            },
          },
        },
        required: ["tasks"],
      },
    },
  },

  // 26 Waterfall (numeric decomposition)
  {
    type: "function" as const,
    function: {
      name: "createWaterfallPage",
      description: "Create a numeric waterfall steps placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          steps: {
            type: "array",
            items: { type: "object", properties: { label: { type: "string" }, value: { type: "number" } }, required: ["label", "value"] },
          },
        },
        required: ["steps"],
      },
    },
  },

  // 27 Funnel
  {
    type: "function" as const,
    function: {
      name: "createFunnelPage",
      description: "Create a funnel stages placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: {
            type: "array",
            minItems: 3,
            items: { type: "object", properties: { label: { type: "string" }, value: { type: "number" } }, required: ["label", "value"] },
          },
        },
        required: ["stages"],
      },
    },
  },

  // 28 2x2 matrix
  {
    type: "function" as const,
    function: {
      name: "createTwoByTwoMatrixPage",
      description: "Create a 2x2 matrix with quadrant items.",
      parameters: {
        type: "object",
        properties: {
          xAxis: { type: "string" },
          yAxis: { type: "string" },
          quadrants: { type: "array", minItems: 4, maxItems: 4, items: { type: "array", items: { type: "string" } } },
        },
        required: ["xAxis", "yAxis", "quadrants"],
      },
    },
  },

  // 29 BCG matrix
  {
    type: "function" as const,
    function: {
      name: "createBcgMatrixPage",
      description: "Create a BCG matrix placeholder.",
      parameters: {
        type: "object",
        properties: {
          stars: { type: "array", items: { type: "string" } },
          cashCows: { type: "array", items: { type: "string" } },
          questionMarks: { type: "array", items: { type: "string" } },
          dogs: { type: "array", items: { type: "string" } },
        },
        required: ["stars", "cashCows", "questionMarks", "dogs"],
      },
    },
  },

  // 30 GE-McKinsey matrix
  {
    type: "function" as const,
    function: {
      name: "createGeMcKinseyMatrixPage",
      description: "Create a GE-McKinsey 3x3 matrix placeholder.",
      parameters: {
        type: "object",
        properties: {
          industryAttractiveness: { type: "array", items: { type: "string" } },
          competitiveStrength: { type: "array", items: { type: "string" } },
          placements: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, row: { type: "number" }, col: { type: "number" } },
              required: ["name", "row", "col"],
            },
          },
        },
        required: ["placements"],
      },
    },
  },

  // 31 Marimekko (placeholder)
  {
    type: "function" as const,
    function: {
      name: "createMarimekkoPlaceholderPage",
      description: "Create a Marimekko chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          categories: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["categories"],
      },
    },
  },

  // 32 Bubble chart (placeholder)
  {
    type: "function" as const,
    function: {
      name: "createBubbleChartPlaceholderPage",
      description: "Create a bubble chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: { label: { type: "string" }, x: { type: "number" }, y: { type: "number" }, r: { type: "number" } },
              required: ["label", "x", "y", "r"],
            },
          },
        },
        required: ["points"],
      },
    },
  },

  // 33 Heatmap (placeholder)
  {
    type: "function" as const,
    function: {
      name: "createHeatmapPlaceholderPage",
      description: "Create a heatmap placeholder.",
      parameters: {
        type: "object",
        properties: {
          rows: { type: "array", items: { type: "string" }, minItems: 1 },
          cols: { type: "array", items: { type: "string" }, minItems: 1 },
          values: { type: "array", items: { type: "array", items: { type: "number" } } },
        },
        required: ["rows", "cols", "values"],
      },
    },
  },

  // 34 KPI highlight
  {
    type: "function" as const,
    function: {
      name: "createKpiHighlightPage",
      description: "Create a slide highlighting key KPIs.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          kpis: {
            type: "array",
            items: {
              type: "object",
              properties: { label: { type: "string" }, value: { type: "string" }, delta: { type: "string" } },
              required: ["label", "value"],
            },
          },
        },
        required: ["kpis"],
      },
    },
  },

  // 35 Before/After
  {
    type: "function" as const,
    function: {
      name: "createBeforeAfterPage",
      description: "Create a before vs after comparison page.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          before: { type: "array", items: { type: "string" }, minItems: 1 },
          after: { type: "array", items: { type: "string" }, minItems: 1 },
        },
        required: ["before", "after"],
      },
    },
  },

  // 36 Option evaluation (criteria x options)
  {
    type: "function" as const,
    function: {
      name: "createOptionEvaluationPage",
      description: "Create an options vs criteria evaluation matrix.",
      parameters: {
        type: "object",
        properties: {
          criteria: { type: "array", items: { type: "string" }, minItems: 3 },
          options: { type: "array", items: { type: "string" }, minItems: 2 },
          scores: { type: "array", items: { type: "array", items: { type: "number" } } },
        },
        required: ["criteria", "options"],
      },
    },
  },

  // 37 Risk & mitigation
  {
    type: "function" as const,
    function: {
      name: "createRiskMitigationPage",
      description: "Create a risk register with mitigations.",
      parameters: {
        type: "object",
        properties: {
          risks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                risk: { type: "string" },
                impact: { type: "string" },
                likelihood: { type: "string" },
                mitigation: { type: "string" },
              },
              required: ["risk"],
            },
          },
        },
        required: ["risks"],
      },
    },
  },

  // 38 Positioning map
  {
    type: "function" as const,
    function: {
      name: "createPositioningMapPage",
      description: "Create a competitive positioning map.",
      parameters: {
        type: "object",
        properties: {
          xAxis: { type: "string" },
          yAxis: { type: "string" },
          players: {
            type: "array",
            items: { type: "object", properties: { name: { type: "string" }, x: { type: "number" }, y: { type: "number" } }, required: ["name", "x", "y"] },
          },
        },
        required: ["xAxis", "yAxis", "players"],
      },
    },
  },

  // 39 TAM/SAM/SOM
  {
    type: "function" as const,
    function: {
      name: "createTamSamSomPage",
      description: "Create a market size (TAM/SAM/SOM) page.",
      parameters: {
        type: "object",
        properties: {
          tam: { type: "number" },
          sam: { type: "number" },
          som: { type: "number" },
          notes: { type: "string" },
        },
        required: ["tam", "sam", "som"],
      },
    },
  },

  // 40 Market drivers
  {
    type: "function" as const,
    function: {
      name: "createMarketDriversPage",
      description: "Create a list of market growth drivers.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          drivers: { type: "array", items: { type: "string" }, minItems: 1 },
        },
        required: ["drivers"],
      },
    },
  },

  // 41 Revenue model
  {
    type: "function" as const,
    function: {
      name: "createRevenueModelPage",
      description: "Create revenue streams and pricing notes.",
      parameters: {
        type: "object",
        properties: {
          streams: { type: "array", items: { type: "string" }, minItems: 1 },
          pricingNotes: { type: "string" },
        },
        required: ["streams"],
      },
    },
  },

  // 42 Cost structure
  {
    type: "function" as const,
    function: {
      name: "createCostStructurePage",
      description: "Create a cost structure with buckets and notes.",
      parameters: {
        type: "object",
        properties: {
          buckets: { type: "array", items: { type: "string" }, minItems: 1 },
          fixedVsVariable: { type: "array", items: { type: "string" } },
        },
        required: ["buckets"],
      },
    },
  },

  // 43 Org chart
  {
    type: "function" as const,
    function: {
      name: "createOrgChartPage",
      description: "Create a simple org chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: { id: { type: "string" }, label: { type: "string" }, parentId: { type: "string" } },
              required: ["id", "label"],
            },
          },
        },
        required: ["nodes"],
      },
    },
  },

  // 44 Capability maturity
  {
    type: "function" as const,
    function: {
      name: "createCapabilityMaturityPage",
      description: "Create a capability maturity model (1–5).",
      parameters: {
        type: "object",
        properties: {
          capabilities: {
            type: "array",
            items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } }, required: ["name", "level"] },
          },
        },
        required: ["capabilities"],
      },
    },
  },

  // 45 Technology roadmap
  {
    type: "function" as const,
    function: {
      name: "createTechRoadmapPage",
      description: "Create a technology roadmap with phases.",
      parameters: {
        type: "object",
        properties: {
          phases: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: { type: "object", properties: { phase: { type: "string" }, label: { type: "string" } }, required: ["phase", "label"] },
          },
        },
        required: ["phases"],
      },
    },
  },

  // 46 Digital maturity
  {
    type: "function" as const,
    function: {
      name: "createDigitalMaturityPage",
      description: "Create a digital maturity assessment.",
      parameters: {
        type: "object",
        properties: {
          dimensions: { type: "array", items: { type: "string" } },
          levels: { type: "array", items: { type: "number" } },
          notes: { type: "string" },
        },
        required: ["dimensions"],
      },
    },
  },

  // 47 Ecosystem map
  {
    type: "function" as const,
    function: {
      name: "createEcosystemMapPage",
      description: "Create an ecosystem or partner map.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" } },
          entities: {
            type: "array",
            items: { type: "object", properties: { category: { type: "string" }, name: { type: "string" } }, required: ["category", "name"] },
          },
        },
        required: ["entities"],
      },
    },
  },

  // 48 Change curve
  {
    type: "function" as const,
    function: {
      name: "createChangeCurvePage",
      description: "Create a change curve with stages.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 4 },
          notes: { type: "string" },
        },
        required: ["stages"],
      },
    },
  },

  // 49 Communication plan
  {
    type: "function" as const,
    function: {
      name: "createCommunicationPlanPage",
      description: "Create a communication plan matrix.",
      parameters: {
        type: "object",
        properties: {
          audiences: { type: "array", items: { type: "string" } },
          channels: { type: "array", items: { type: "string" } },
          cadence: { type: "string" },
        },
        required: ["audiences", "channels"],
      },
    },
  },

  // 50 Integration plan (PMI)
  {
    type: "function" as const,
    function: {
      name: "createIntegrationPlanPage",
      description: "Create a post-merger integration (PMI) plan placeholder.",
      parameters: {
        type: "object",
        properties: {
          workstreams: { type: "array", items: { type: "string" }, minItems: 2 },
          milestones: { type: "array", items: { type: "string" } },
        },
        required: ["workstreams"],
      },
    },
  },

  // 51 Benchmarking table
  {
    type: "function" as const,
    function: {
      name: "createBenchmarkingTablePage",
      description: "Create a benchmarking comparison table.",
      parameters: {
        type: "object",
        properties: {
          metrics: { type: "array", items: { type: "string" }, minItems: 1 },
          competitors: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["metrics", "competitors"],
      },
    },
  },

  // 52 Survey results
  {
    type: "function" as const,
    function: {
      name: "createSurveyResultsPage",
      description: "Create a survey results summary.",
      parameters: {
        type: "object",
        properties: {
          questions: { type: "array", items: { type: "string" } },
          summaries: { type: "array", items: { type: "string" } },
        },
        required: ["questions"],
      },
    },
  },

  // 53 Personas
  {
    type: "function" as const,
    function: {
      name: "createPersonasPage",
      description: "Create customer persona cards.",
      parameters: {
        type: "object",
        properties: {
          personas: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, bio: { type: "string" }, needs: { type: "array", items: { type: "string" } } },
              required: ["name"],
            },
          },
        },
        required: ["personas"],
      },
    },
  },

  // 54 Segmentation
  {
    type: "function" as const,
    function: {
      name: "createSegmentationPage",
      description: "Create a customer segmentation page.",
      parameters: {
        type: "object",
        properties: {
          segments: { type: "array", items: { type: "string" }, minItems: 2 },
          descriptors: { type: "array", items: { type: "string" } },
        },
        required: ["segments"],
      },
    },
  },

  // 55 Pricing waterfall
  {
    type: "function" as const,
    function: {
      name: "createPricingWaterfallPage",
      description: "Create a pricing waterfall placeholder.",
      parameters: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: { type: "object", properties: { label: { type: "string" }, value: { type: "number" } }, required: ["label", "value"] },
          },
        },
        required: ["steps"],
      },
    },
  },

  // 56 Sensitivity analysis
  {
    type: "function" as const,
    function: {
      name: "createSensitivityAnalysisPage",
      description: "Create a sensitivity analysis placeholder.",
      parameters: {
        type: "object",
        properties: {
          variables: { type: "array", items: { type: "string" }, minItems: 2 },
          scenarios: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["variables", "scenarios"],
      },
    },
  },

  // 57 P&L breakdown
  {
    type: "function" as const,
    function: {
      name: "createPLBreakdownPage",
      description: "Create a P&L breakdown placeholder.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" }, minItems: 3 },
          values: { type: "array", items: { type: "number" }, minItems: 3 },
        },
        required: ["categories", "values"],
      },
    },
  },

  // 58 Cash flow
  {
    type: "function" as const,
    function: {
      name: "createCashFlowPage",
      description: "Create a cash flow summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          inflows: { type: "array", items: { type: "number" } },
          outflows: { type: "array", items: { type: "number" } },
        },
        required: ["inflows", "outflows"],
      },
    },
  },

  // 59 Balance sheet
  {
    type: "function" as const,
    function: {
      name: "createBalanceSheetPage",
      description: "Create a balance sheet summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          assets: { type: "array", items: { type: "string" } },
          liabilities: { type: "array", items: { type: "string" } },
          equity: { type: "array", items: { type: "string" } },
        },
        required: ["assets", "liabilities", "equity"],
      },
    },
  },

  // 60 Shareholder value tree
  {
    type: "function" as const,
    function: {
      name: "createShareholderValueTreePage",
      description: "Create a shareholder value driver tree.",
      parameters: {
        type: "object",
        properties: {
          drivers: { type: "array", items: { type: "string" }, minItems: 3 },
        },
        required: ["drivers"],
      },
    },
  },

  // 61 NPV summary
  {
    type: "function" as const,
    function: {
      name: "createNpvSummaryPage",
      description: "Create an NPV summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          npv: { type: "number" },
          assumptions: { type: "array", items: { type: "string" } },
        },
        required: ["npv"],
      },
    },
  },

  // 62 Scenario planning
  {
    type: "function" as const,
    function: {
      name: "createScenarioPlanningPage",
      description: "Create a scenario planning page.",
      parameters: {
        type: "object",
        properties: {
          scenarios: { type: "array", items: { type: "string" }, minItems: 2 },
          impacts: { type: "array", items: { type: "string" } },
        },
        required: ["scenarios"],
      },
    },
  },

  // 63 Compliance heatmap
  {
    type: "function" as const,
    function: {
      name: "createComplianceHeatmapPage",
      description: "Create a compliance heatmap placeholder.",
      parameters: {
        type: "object",
        properties: {
          areas: { type: "array", items: { type: "string" } },
          levels: { type: "array", items: { type: "string" } },
        },
        required: ["areas"],
      },
    },
  },

  // 64 ESG framework
  {
    type: "function" as const,
    function: {
      name: "createEsgFrameworkPage",
      description: "Create an ESG framework summary.",
      parameters: {
        type: "object",
        properties: {
          environmental: { type: "array", items: { type: "string" } },
          social: { type: "array", items: { type: "string" } },
          governance: { type: "array", items: { type: "string" } },
        },
        required: ["environmental", "social", "governance"],
      },
    },
  },

  // 65 CSR initiatives
  {
    type: "function" as const,
    function: {
      name: "createCsrInitiativesPage",
      description: "Create a CSR initiatives page.",
      parameters: {
        type: "object",
        properties: {
          initiatives: { type: "array", items: { type: "string" }, minItems: 1 },
        },
        required: ["initiatives"],
      },
    },
  },

  // 66 Sustainability roadmap
  {
    type: "function" as const,
    function: {
      name: "createSustainabilityRoadmapPage",
      description: "Create a sustainability roadmap.",
      parameters: {
        type: "object",
        properties: {
          phases: { type: "array", items: { type: "string" }, minItems: 2 },
          actions: { type: "array", items: { type: "string" } },
        },
        required: ["phases"],
      },
    },
  },

  // 67 Circular economy map
  {
    type: "function" as const,
    function: {
      name: "createCircularEconomyMapPage",
      description: "Create a circular economy loop map placeholder.",
      parameters: {
        type: "object",
        properties: {
          loops: { type: "array", items: { type: "string" }, minItems: 3 },
        },
        required: ["loops"],
      },
    },
  },

  // 68 Innovation funnel
  {
    type: "function" as const,
    function: {
      name: "createInnovationFunnelPage",
      description: "Create an innovation funnel placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          counts: { type: "array", items: { type: "number" } },
        },
        required: ["stages"],
      },
    },
  },

  // 69 Product roadmap
  {
    type: "function" as const,
    function: {
      name: "createProductRoadmapPage",
      description: "Create a product roadmap.",
      parameters: {
        type: "object",
        properties: {
          releases: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: { type: "object", properties: { release: { type: "string" }, label: { type: "string" } }, required: ["release", "label"] },
          },
        },
        required: ["releases"],
      },
    },
  },

  // 70 Launch plan
  {
    type: "function" as const,
    function: {
      name: "createLaunchPlanPage",
      description: "Create a go-to-market launch plan.",
      parameters: {
        type: "object",
        properties: {
          workstreams: { type: "array", items: { type: "string" } },
          milestones: { type: "array", items: { type: "string" } },
          risks: { type: "array", items: { type: "string" } },
        },
        required: ["workstreams"],
      },
    },
  },

  // 71 Pipeline funnel
  {
    type: "function" as const,
    function: {
      name: "createPipelineFunnelPage",
      description: "Create a pipeline funnel placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          values: { type: "array", items: { type: "number" } },
        },
        required: ["stages"],
      },
    },
  },

  // 72 Sales dashboard
  {
    type: "function" as const,
    function: {
      name: "createSalesDashboardPage",
      description: "Create a sales dashboard placeholder.",
      parameters: {
        type: "object",
        properties: {
          metrics: { type: "array", items: { type: "string" }, minItems: 3 },
          notes: { type: "string" },
        },
        required: ["metrics"],
      },
    },
  },

  // 73 Marketing mix
  {
    type: "function" as const,
    function: {
      name: "createMarketingMixPage",
      description: "Create a marketing mix summary.",
      parameters: {
        type: "object",
        properties: {
          levers: { type: "array", items: { type: "string" }, minItems: 4 },
          notes: { type: "string" },
        },
        required: ["levers"],
      },
    },
  },

  // 74 Customer success journey
  {
    type: "function" as const,
    function: {
      name: "createCustomerSuccessJourneyPage",
      description: "Create a customer success journey map.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          metrics: { type: "array", items: { type: "string" } },
        },
        required: ["stages"],
      },
    },
  },

  // 75 Support org model
  {
    type: "function" as const,
    function: {
      name: "createSupportOrgModelPage",
      description: "Create a support organization model placeholder.",
      parameters: {
        type: "object",
        properties: {
          tiers: { type: "array", items: { type: "string" }, minItems: 2 },
          roles: { type: "array", items: { type: "string" } },
        },
        required: ["tiers"],
      },
    },
  },

  // 76 Partnership map
  {
    type: "function" as const,
    function: {
      name: "createPartnershipMapPage",
      description: "Create a partnership ecosystem map.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" } },
          partners: { type: "array", items: { type: "object", properties: { name: { type: "string" }, category: { type: "string" } }, required: ["name"] } },
        },
        required: ["partners"],
      },
    },
  },

  // 77 M&A pipeline
  {
    type: "function" as const,
    function: {
      name: "createMAPipelinePage",
      description: "Create an M&A pipeline placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          targets: { type: "array", items: { type: "string" } },
        },
        required: ["stages"],
      },
    },
  },

  // 78 Synergy capture
  {
    type: "function" as const,
    function: {
      name: "createSynergyCapturePage",
      description: "Create a synergy capture plan placeholder.",
      parameters: {
        type: "object",
        properties: {
          sources: { type: "array", items: { type: "string" } },
          values: { type: "array", items: { type: "number" } },
        },
        required: ["sources"],
      },
    },
  },

  // 79 Culture values
  {
    type: "function" as const,
    function: {
      name: "createCultureValuesPage",
      description: "Create a culture and values page.",
      parameters: {
        type: "object",
        properties: {
          values: { type: "array", items: { type: "string" }, minItems: 3 },
          behaviors: { type: "array", items: { type: "string" } },
        },
        required: ["values"],
      },
    },
  },

  // 80 Thank-you / Contact
  {
    type: "function" as const,
    function: {
      name: "createThankYouContactPage",
      description: "Create a closing page with a thank-you message and contacts.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", default: "Thank you!" },
          name: { type: "string" },
          email: { type: "string" },
          url: { type: "string" },
          qrImageUrl: { type: "string" },
        },
        required: ["message"],
      },
    },
  },
] as any;
