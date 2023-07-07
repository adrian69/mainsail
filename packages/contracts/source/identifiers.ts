export const Identifiers = {
	Application: Symbol.for("Application<Instance>"),
	ApplicationDirPrefix: Symbol.for("Application<DirPrefix>"),
	ApplicationEnvironment: Symbol.for("Application<Environment>"),
	ApplicationNamespace: Symbol.for("Application<Namespace>"),
	ApplicationNetwork: Symbol.for("Application<Network>"),
	ApplicationToken: Symbol.for("Application<Token>"),
	ApplicationVersion: Symbol.for("Application<Version>"),
	BlockHistoryService: Symbol.for("Service<BlockHistory>"),
	BlockProcessor: Symbol.for("Block<Processor>"),
	BlockState: Symbol.for("State<Block>"),
	BlockchainService: Symbol.for("Service<Blockchain>"),
	CacheFactory: Symbol.for("Factory<Cache>"),
	CacheManager: Symbol.for("Manager<Cache>"),
	CacheService: Symbol.for("Service<Cache>"),
	ConfigFlags: Symbol.for("Config<Flags>"),
	ConfigManager: Symbol.for("Manager<Config>"),
	ConfigPlugins: Symbol.for("Config<Plugins>"),
	ConfigRepository: Symbol.for("Repository<Config>"),
	ConfigService: Symbol.for("Service<Config>"),
	Consensus: {
		Bootstrapper: Symbol.for("Bootstrapper<Consensus>"),
		Handler: Symbol.for("Handler<Consensus>"),
		ProposerPicker: Symbol.for("Consensus<ProposerPicker>"),
		RoundStateRepository: Symbol.for("Repository<Consensus.RoundState>"),
		Scheduler: Symbol.for("Scheduler<Consensus>"),
		Service: Symbol.for("Service<Consensus>"),
		Storage: Symbol.for("Storage<Consensus>"),
		ValidatorRepository: Symbol.for("Repository<Consensus.Validator>"),
	},
	Crypto: Symbol.for("Crypto<NetworkConfig>"),
	Cryptography: {
		Block: {
			Deserializer: Symbol.for("Crypto<Block.Deserializer>"),
			Factory: Symbol.for("Crypto<Block.Factory>"),
			IDFactory: Symbol.for("Crypto<Block.IDFactory>"),
			Serializer: Symbol.for("Crypto<Block.Serializer>"),
			Verifier: Symbol.for("Crypto<Block.Verifier>"),
		},
		Configuration: Symbol.for("Crypto<Configuration>"),
		HashFactory: Symbol.for("Crypto<HashFactory>"),
		Identity: {
			AddressFactory: Symbol.for("Crypto<Identity.AddressFactory>"),
			AddressSerializer: Symbol.for("Crypto<Identity.AddressSerializer>"),
			KeyPairFactory: Symbol.for("Crypto<Identity.KeyPairFactory>"),
			PrivateKeyFactory: Symbol.for("Crypto<Identity.PrivateKeyFactory>"),
			PublicKeyFactory: Symbol.for("Crypto<Identity.PublicKeyFactory>"),
			PublicKeySerializer: Symbol.for("Crypto<Identity.PublicKeySerializer>"),
			WifFactory: Symbol.for("Crypto<Identity.WifFactory>"),
		},
		Message: {
			Deserializer: Symbol.for("Crypto<Message.Deserializer>"),
			Factory: Symbol.for("Crypto<Message.Factory>"),
			Serializer: Symbol.for("Crypto<Message.Serializer>"),
			Verifier: Symbol.for("Crypto<Message.Verifier>"),
		},
		Serializer: Symbol.for("Crypto<Serializer>"),
		Signature: Symbol.for("Crypto<Signature>"),
		Size: {
			Address: Symbol.for("Crypto<Size.Address>"),
			HASH256: Symbol.for("Crypto<Size.HASH256>"),
			PublicKey: Symbol.for("Crypto<Size.PublicKey>"),
			RIPEMD160: Symbol.for("Crypto<Size.RIPEMD160>"),
			SHA256: Symbol.for("Crypto<Size.SHA256>"),
			Signature: Symbol.for("Crypto<Size.Signature>"),
		},
		Transaction: {
			Deserializer: Symbol.for("Crypto<Transaction.Deserializer>"),
			Factory: Symbol.for("Crypto<Transaction.Factory>"),
			Registry: Symbol.for("Crypto<Transaction.Registry>"),
			Serializer: Symbol.for("Crypto<Transaction.Serializer>"),
			Signer: Symbol.for("Crypto<Transaction.Signer>"),
			TypeFactory: Symbol.for("Crypto<Transaction.TypeFactory>"),
			Utils: Symbol.for("Crypto<Transaction.Utils>"),
			Verifier: Symbol.for("Crypto<Transaction.Verifier>"),
		},
		Validator: Symbol.for("Crypto<Validator>"),
	},
	Database: {
		BlockHeightStorage: Symbol.for("Database<BlockHeightStorage>"),
		BlockStorage: Symbol.for("Database<BlockStorage>"),
		ConsensusStorage: Symbol.for("Database<ConsensusStorage>"),
		PrecommitStorage: Symbol.for("Database<PrecommitStorage>"),
		PrevoteStorage: Symbol.for("Database<PrevoteStorage>"),
		ProposalStorage: Symbol.for("Database<ProposalStorage>"),
		RootStorage: Symbol.for("Database<RootStorage>"),
		RoundStorage: Symbol.for("Database<RoundStorage>"),
		Service: Symbol.for("Database<Service>"),
		TransactionStorage: Symbol.for("Database<TransactionStorage>"),
	},
	// @deprecated
	DatabaseInteraction: Symbol.for("Database<DatabaseInteraction>"),
	EventDispatcherManager: Symbol.for("Manager<EventDispatcher>"),
	EventDispatcherService: Symbol.for("Service<EventDispatcher>"),
	Fee: {
		Matcher: Symbol.for("Fee<Matcher>"),
		Registry: Symbol.for("Fee<Registry>"),
		Type: Symbol.for("Fee<Type>"),
	},
	FilesystemManager: Symbol.for("Manager<Filesystem>"),
	FilesystemService: Symbol.for("Service<Filesystem>"),
	Forger: {
		Service: Symbol.for("Forger<Service>"),
		Tracker: Symbol.for("Forger<Tracker>"),
		Usernames: Symbol.for("Forger<Usernames>"),
		Validators: Symbol.for("Forger<Validators>"),
	},
	LogManager: Symbol.for("Manager<Log>"),
	LogService: Symbol.for("Service<Log>"),
	MixinService: Symbol.for("Service<Mixin>"),
	P2P: {
		Server: Symbol.for("P2P<Server>"),
	},
	P2PServer: Symbol.for("Server<P2P>"),
	PeerBlockDownloader: Symbol.for("Peer<BlockDownloader>"),
	PeerBroadcaster: Symbol.for("Peer<Broadcaster>"),
	PeerChunkCache: Symbol.for("Peer<ChunkCache>"),
	PeerCommunicator: Symbol.for("Peer<Communicator>"),
	PeerConnector: Symbol.for("Peer<Connector>"),
	PeerDiscoverer: Symbol.for("Peer<Discoverer>"),
	PeerDownloader: Symbol.for("Peer<Downloader>"),
	PeerFactory: Symbol.for("Factory<Peer>"),
	PeerHeaderFactory: Symbol.for("Factory<PeerHeader>"),
	PeerHeaderService: Symbol.for("Peer<HeaderService>"),
	PeerNetworkMonitor: Symbol.for("Peer<NetworkMonitor>"),
	PeerProcessor: Symbol.for("Peer<Processor>"),
	PeerRepository: Symbol.for("Peer<Repository>"),
	PipelineFactory: Symbol.for("Factory<Pipeline>"),
	PipelineService: Symbol.for("Service<Pipeline>"),
	PluginConfiguration: Symbol.for("PluginConfiguration"),
	ProcessActionsManager: Symbol.for("Manager<ProcessAction>"),
	ProcessActionsService: Symbol.for("Service<ProcessActions>"),
	QueueFactory: Symbol.for("Factory<Queue>"),
	QueueManager: Symbol.for("Manager<Queue>"),
	QueueService: Symbol.for("Service<Queue>"),
	ScheduleService: Symbol.for("Service<Schedule>"),
	ServiceProviderRepository: Symbol.for("Repository<ServiceProvider>"),
	SnapshotService: Symbol.for("Service<Snapshot>"),
	StandardCriteriaService: Symbol.for("Service<StandardCriteriaService>"),
	State: {
		ValidatorMutator: Symbol.for("State<ValidatorMutator>"),
	},
	StateBuilder: Symbol.for("State<StateBuilder>"),
	StateMachine: Symbol.for("Blockchain<StateMachine>"),
	StateStore: Symbol.for("State<StateStore>"),
	TransactionHandler: Symbol.for("TransactionHandler"),
	TransactionHandlerConstructors: Symbol.for("TransactionHandlerConstructors"),
	TransactionHandlerProvider: Symbol.for("Provider<TransactionHandler>"),
	TransactionHandlerRegistry: Symbol.for("Registry<TransactionHandler>"),
	TransactionHistoryService: Symbol.for("Service<TransactionHistory>"),
	TransactionPoolCleaner: Symbol.for("TransactionPool<Cleaner>"),
	TransactionPoolCollator: Symbol.for("TransactionPool<Collator>"),
	TransactionPoolExpirationService: Symbol.for("TransactionPool<ExpirationService>"),
	TransactionPoolMempool: Symbol.for("TransactionPool<Mempool>"),
	TransactionPoolProcessor: Symbol.for("TransactionPool<Processor>"),
	TransactionPoolProcessorExtension: Symbol.for("TransactionPool<ProcessorExtension>"),
	TransactionPoolProcessorFactory: Symbol.for("TransactionPool<ProcessorFactory>"),
	TransactionPoolQuery: Symbol.for("TransactionPool<Query>"),
	TransactionPoolSenderMempool: Symbol.for("TransactionPool<SenderMempool>"),
	TransactionPoolSenderMempoolFactory: Symbol.for("TransactionPool<SenderMempoolFactory>"),
	TransactionPoolSenderState: Symbol.for("TransactionPool<SenderState>"),
	TransactionPoolServer: Symbol.for("TransactionPool<Server>"),
	TransactionPoolService: Symbol.for("TransactionPool<Service>"),
	TransactionPoolStorage: Symbol.for("TransactionPool<Storage>"),
	TransactionValidator: Symbol.for("State<TransactionValidator>"),
	TransactionValidatorFactory: Symbol.for("State<TransactionValidatorFactory>"),
	TriggerService: Symbol.for("Service<Actions>"),
	ValidationManager: Symbol.for("Manager<Validation>"),
	ValidationService: Symbol.for("Service<Validation>"),
	ValidatorSet: Symbol.for("Set<ValidatorSet>"),
	WalletAttributes: Symbol.for("Wallet<Attributes>"),
	WalletFactory: Symbol.for("State<WalletFactory>"),
	WalletRepository: Symbol.for("Repository<Wallet>"),
	WalletRepositoryIndexerIndex: Symbol.for("IndexerIndex<Repository<Wallet>>"),
	WatcherDatabaseService: Symbol.for("Watcher<DatabaseService>"),
	WatcherEventListener: Symbol.for("Watcher<EventListener>"),
};
