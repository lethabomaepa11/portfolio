CREATE TABLE IF NOT EXISTS ab_experiments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    section_key TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ab_variants (
    id BIGSERIAL PRIMARY KEY,
    experiment_id BIGINT NOT NULL REFERENCES ab_experiments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weight NUMERIC DEFAULT 1.0,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ab_assignments (
    id BIGSERIAL PRIMARY KEY,
    experiment_id BIGINT NOT NULL REFERENCES ab_experiments(id) ON DELETE CASCADE,
    variant_id BIGINT NOT NULL REFERENCES ab_variants(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(experiment_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS ab_events (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES ab_assignments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ab_variants_experiment ON ab_variants(experiment_id);
CREATE INDEX idx_ab_assignments_visitor ON ab_assignments(visitor_id);
CREATE INDEX idx_ab_assignments_experiment ON ab_assignments(experiment_id);
CREATE INDEX idx_ab_events_assignment ON ab_events(assignment_id);
CREATE INDEX idx_ab_events_type ON ab_events(event_type);
