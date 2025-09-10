import express from "express";

const router = express.Router();

// US Economic Policy Categories and Explanations
const economicPolicies = {
  "monetary-policy": {
    title: "Monetary Policy",
    description: "How the Federal Reserve controls money supply and interest rates",
    policies: [
      {
        name: "Federal Funds Rate",
        description: "The interest rate banks charge each other for overnight loans",
        impact: "Affects all other interest rates in the economy, including mortgages, credit cards, and business loans",
        currentStatus: "Managed by the Federal Open Market Committee (FOMC)"
      },
      {
        name: "Quantitative Easing (QE)",
        description: "Large-scale asset purchases to increase money supply",
        impact: "Lowers long-term interest rates and increases bank lending capacity",
        currentStatus: "Used during economic crises to stimulate growth"
      },
      {
        name: "Reserve Requirements",
        description: "Minimum amount of cash banks must hold relative to deposits",
        impact: "Controls how much money banks can lend out to consumers and businesses",
        currentStatus: "Set by Federal Reserve Board of Governors"
      }
    ]
  },
  "fiscal-policy": {
    title: "Fiscal Policy",
    description: "Government spending and taxation decisions to influence the economy",
    policies: [
      {
        name: "Tax Policy",
        description: "Federal income, corporate, and other tax rates and structures",
        impact: "Affects disposable income, business investment, and economic growth",
        currentStatus: "Determined by Congress and implemented by Treasury/IRS"
      },
      {
        name: "Government Spending",
        description: "Federal budget allocations for defense, infrastructure, social programs",
        impact: "Direct economic stimulus through job creation and demand increase",
        currentStatus: "Annual budget process through Congress"
      },
      {
        name: "Stimulus Programs",
        description: "Temporary spending increases during economic downturns",
        impact: "Provides immediate economic support to individuals and businesses",
        currentStatus: "Implemented during recessions or crises"
      }
    ]
  },
  "trade-policy": {
    title: "Trade Policy", 
    description: "International trade agreements, tariffs, and commercial relationships",
    policies: [
      {
        name: "Tariffs and Trade Wars",
        description: "Import taxes and retaliatory measures between countries",
        impact: "Affects consumer prices, domestic industry protection, and international relations",
        currentStatus: "Ongoing negotiations with China, EU, and other major trading partners"
      },
      {
        name: "Free Trade Agreements",
        description: "Treaties reducing trade barriers between countries (NAFTA/USMCA, etc.)",
        impact: "Increases trade volume, affects domestic jobs, and economic specialization",
        currentStatus: "Multiple active agreements with various review and update cycles"
      },
      {
        name: "Export Controls",
        description: "Restrictions on technology and strategic material exports",
        impact: "National security protection but may limit business opportunities",
        currentStatus: "Administered by Commerce Department and other agencies"
      }
    ]
  },
  "financial-regulation": {
    title: "Financial Regulation",
    description: "Rules governing banks, investment firms, and financial markets",
    policies: [
      {
        name: "Dodd-Frank Act",
        description: "Comprehensive financial reform legislation passed after 2008 crisis",
        impact: "Increased bank capital requirements and consumer protection",
        currentStatus: "Ongoing implementation and periodic modifications"
      },
      {
        name: "Bank Stress Tests",
        description: "Annual assessments of major banks' ability to handle economic shocks",
        impact: "Ensures banking system stability and prevents excessive risk-taking",
        currentStatus: "Conducted annually by Federal Reserve"
      },
      {
        name: "Consumer Financial Protection",
        description: "Rules protecting consumers from predatory lending and unfair practices",
        impact: "Safer financial products but may limit credit availability",
        currentStatus: "Enforced by Consumer Financial Protection Bureau (CFPB)"
      }
    ]
  },
  "employment-policy": {
    title: "Employment Policy",
    description: "Laws and programs affecting jobs, wages, and workplace conditions",
    policies: [
      {
        name: "Minimum Wage Laws",
        description: "Federal and state requirements for minimum hourly wages",
        impact: "Affects low-wage workers' income and business labor costs",
        currentStatus: "Federal minimum $7.25/hour, many states have higher rates"
      },
      {
        name: "Unemployment Insurance",
        description: "Temporary financial support for workers who lose jobs",
        impact: "Economic safety net that maintains consumer spending during downturns",
        currentStatus: "Joint federal-state program with varying benefit levels"
      },
      {
        name: "Job Training Programs",
        description: "Federal funding for workforce development and skills training",
        impact: "Helps workers adapt to changing economy and improves productivity",
        currentStatus: "Various programs through Department of Labor and other agencies"
      }
    ]
  },
  "environmental-economic": {
    title: "Environmental Economic Policy",
    description: "Policies linking environmental goals with economic outcomes",
    policies: [
      {
        name: "Carbon Pricing",
        description: "Market-based approaches to reduce greenhouse gas emissions",
        impact: "Creates incentives for clean energy while potentially raising costs",
        currentStatus: "Some state programs, federal proposals under consideration"
      },
      {
        name: "Energy Subsidies",
        description: "Tax credits and direct support for renewable and traditional energy",
        impact: "Influences energy mix and affects utility costs and jobs",
        currentStatus: "Ongoing support for solar, wind, oil, and other energy sources"
      },
      {
        name: "Environmental Regulations",
        description: "EPA and other agency rules affecting business operations",
        impact: "Protects public health but may increase business compliance costs",
        currentStatus: "Continuous rulemaking process with changing priorities"
      }
    ]
  }
};

// Get all policy categories
router.get("/categories", (req, res) => {
  try {
    const categories = Object.keys(economicPolicies).map(key => ({
      id: key,
      title: economicPolicies[key].title,
      description: economicPolicies[key].description,
      policyCount: economicPolicies[key].policies.length
    }));
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching policy categories" });
  }
});

// Get specific policy category details
router.get("/categories/:categoryId", (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = economicPolicies[categoryId];
    
    if (!category) {
      return res.status(404).json({ message: "Policy category not found" });
    }
    
    res.json({
      id: categoryId,
      ...category
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching policy category" });
  }
});

// Search policies by keyword
router.get("/search", (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }
    
    const results = [];
    const searchTerm = query.toLowerCase();
    
    for (const [categoryId, category] of Object.entries(economicPolicies)) {
      // Search in category title and description
      if (category.title.toLowerCase().includes(searchTerm) || 
          category.description.toLowerCase().includes(searchTerm)) {
        results.push({
          categoryId,
          categoryTitle: category.title,
          type: "category",
          match: category.title
        });
      }
      
      // Search in individual policies
      category.policies.forEach(policy => {
        if (policy.name.toLowerCase().includes(searchTerm) ||
            policy.description.toLowerCase().includes(searchTerm) ||
            policy.impact.toLowerCase().includes(searchTerm)) {
          results.push({
            categoryId,
            categoryTitle: category.title,
            type: "policy",
            match: policy.name,
            policy
          });
        }
      });
    }
    
    res.json({
      query,
      results,
      totalCount: results.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching policies" });
  }
});

// Get policy impact analysis
router.get("/impact-analysis", (req, res) => {
  try {
    const analysis = {
      majorTrends: [
        {
          trend: "Rising Interest Rates",
          description: "Federal Reserve raising rates to combat inflation",
          personalImpact: "Higher mortgage rates, credit card rates, but better savings returns",
          businessImpact: "Higher borrowing costs, potential slowdown in expansion"
        },
        {
          trend: "Trade Policy Uncertainty",
          description: "Ongoing negotiations and potential tariff changes",
          personalImpact: "Possible price changes on imported goods",
          businessImpact: "Supply chain adjustments, pricing strategy changes"
        },
        {
          trend: "Green Energy Transition",
          description: "Shift toward renewable energy sources",
          personalImpact: "Potential utility bill changes, new tax incentives",
          businessImpact: "New opportunities in clean tech, stranded assets in fossil fuels"
        }
      ],
      keyIndicators: [
        {
          name: "Federal Funds Rate",
          current: "5.25-5.50%",
          trend: "stable",
          nextUpdate: "Next FOMC meeting"
        },
        {
          name: "Unemployment Rate", 
          current: "3.9%",
          trend: "stable",
          nextUpdate: "Monthly jobs report"
        },
        {
          name: "Inflation Rate (CPI)",
          current: "3.2%",
          trend: "declining", 
          nextUpdate: "Monthly CPI report"
        }
      ]
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Error fetching impact analysis" });
  }
});

export { router as policyRoutes };